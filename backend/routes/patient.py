from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, Literal
from datetime import date
from databases.mysql_conn import get_cursor, MySQLConnection, connection_pool
from databases.mongodb_conn import mongo_db

router = APIRouter()

# ─── SCHEMAS ──────────────────────────────────────────────── Models
class EmergencyContacts(BaseModel):
    ContactName:  str
    Relationship: str
    EContactNum:  str

class PatientCreate(BaseModel):
    PatientName:        str
    BirthDate:          Optional[date] = None
    Sex:                Optional[Literal["Male", "Female"]] = None
    BloodType:          Optional[str] = None
    ContactNumber:      Optional[str] = None
    PatientStatus:      Optional[Literal["Admitted", "Discharged", "Outpatient"]] = None
    RoomNum:            Optional[str] = None
    EmergencyContact:   Optional[list[EmergencyContacts]] = None

# ─── CREATE ───────────────────────────────────────────────────── Insert
@router.post("/patient", status_code=201)
def create_patient(payload: PatientCreate):
    try:
        with get_cursor() as cursor:
            cursor.execute("""
                SELECT PatientID
                FROM Patients
                ORDER BY CAST(SUBSTRING(PatientID, 2) AS UNSIGNED) DESC
                LIMIT 1
            """)
            last_patient = cursor.fetchone()

            if last_patient:
                last_num = int(last_patient["PatientID"][1:])
                new_patient_id = f"P{last_num + 1:03}"
            else:
                new_patient_id = "P001"

            if payload.ContactNumber:
                cursor.execute(
                    "SELECT PatientID FROM Patients WHERE ContactNumber = %s",
                    (payload.ContactNumber,)
                )
                if cursor.fetchone():
                    raise HTTPException(
                        status_code=400,
                        detail="Contact number already in use"
                    )

            cursor.execute(
                """
                INSERT INTO Patients
                (
                    PatientID,
                    PatientName,
                    BirthDate,
                    Sex,
                    BloodType,
                    ContactNumber,
                    PatientStatus,
                    RoomNum
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    new_patient_id,
                    payload.PatientName,
                    payload.BirthDate,
                    payload.Sex,
                    payload.BloodType,
                    payload.ContactNumber,
                    payload.PatientStatus,
                    payload.RoomNum
                )
            )

            if payload.EmergencyContact:
                for contact in payload.EmergencyContact:
                    cursor.execute(
                        """
                        SELECT ContactID
                        FROM Emergency_Contacts
                        WHERE EContactNum = %s
                        """,
                        (contact.EContactNum,)
                    )
                    if cursor.fetchone():
                        raise HTTPException(
                            status_code=400,
                            detail=f"Emergency contact number {contact.EContactNum} already in use"
                        )

                    cursor.execute(
                        """
                        INSERT INTO Emergency_Contacts
                        (
                            PatientID,
                            ContactName,
                            Relationship,
                            EContactNum
                        )
                        VALUES (%s, %s, %s, %s)
                        """,
                        (
                            new_patient_id,
                            contact.ContactName,
                            contact.Relationship,
                            contact.EContactNum
                        )
                    )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {
        "message": f"Patient {new_patient_id} created successfully"
    }

# ─── READ ───────────────────────────────────────────────────── Fetch
@router.get("/patients")
def get_patients(
    status: Optional[Literal["Admitted", "Discharged", "Outpatient"]] = Query(None),
    search: Optional[str] = Query(None)
):
    try:
        with get_cursor() as cursor:
            query = """
                SELECT PatientID, PatientName, BirthDate, Sex, BloodType, ContactNumber, PatientStatus, RoomNum, RegistrationDate
                FROM Patients
                WHERE 1=1
            """
            params = []

            if status:
                query += " AND PatientStatus = %s"
                params.append(status)

            if search:
                query += " AND PatientName LIKE %s"
                params.append(f"%{search}%")

            query += " ORDER BY RegistrationDate DESC"
            cursor.execute(query, params)
            patients = cursor.fetchall()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {"patients": patients}

# ─── UNIFIED ───────────────────────────────────────────────── View
@router.get("/patient/{patientid}")
def get_patient(patientid: str):
    try:
        with get_cursor() as cursor:
            cursor.execute(
                "SELECT * FROM Patients WHERE PatientID = %s",
                (patientid,)
            )
            patient = cursor.fetchone()

            if not patient:
                raise HTTPException(status_code=404, detail="Patient not found")

            cursor.execute(
                "SELECT * FROM Appointments WHERE PatientID = %s",
                (patientid,)
            )
            appointments = cursor.fetchall()

            cursor.execute(
                "SELECT * FROM Emergency_Contacts WHERE PatientID = %s",
                (patientid,)
            )
            contact = cursor.fetchall()

            cursor.execute("""
                SELECT
                    COUNT(*) as TotalBills,
                    SUM(TotalAmount) as TotalAmount,
                    SUM(CASE WHEN PaymentStatus = 'Paid' THEN TotalAmount ELSE 0 END) as Paid,
                    SUM(CASE WHEN PaymentStatus = 'Pending' THEN TotalAmount ELSE 0 END) as Pending,
                    SUM(CASE WHEN PaymentStatus = 'Partially Paid' THEN TotalAmount ELSE 0 END) as PartiallyPaid
                FROM Billing
                WHERE PatientID = %s
            """, (patientid,))
            billing_summary = cursor.fetchone()

            cursor.execute("""
                SELECT 'Appointment Scheduled' as EventType, ApptStatus as Details, CreatedAt as EventDate
                FROM Appointments WHERE PatientID = %s
                UNION ALL
                SELECT 'Visit' as EventType, VisitStatus as Details, VisitDate as EventDate
                FROM Visits WHERE PatientID = %s
                UNION ALL
                SELECT 'Bill Generated' as EventType, PaymentStatus as Details, BillingDate as EventDate
                FROM Billing WHERE PatientID = %s
                ORDER BY EventDate DESC
            """, (patientid, patientid, patientid))
            timeline_mysql = cursor.fetchall()

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    try:
        notes_doc = list(mongo_db.ClinicalNotes.find(
            {"PatientID": patientid}, {"_id": 0}
        ))
        diagnostics_doc = list(mongo_db.DiagnosticRecords.find(
            {"PatientID": patientid}, {"_id": 0}
        ))
        treatments_doc = list(mongo_db.TreatmentPlans.find(
            {"PatientID": patientid}, {"_id": 0}
        ))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"MongoDB error: {str(e)}")

    timeline_mongo = []
    for note in notes_doc:
        if "CreatedAt" in note:
            timeline_mongo.append({
                "EventType": "Clinical Note Added",
                "Details":   note.get("Diagnosis", ""),
                "EventDate": note["CreatedAt"]
            })
    for record in diagnostics_doc:
        if "CreatedAt" in record:
            timeline_mongo.append({
                "EventType": "Diagnostic Record Added",
                "Details":   record.get("TestType", ""),
                "EventDate": record["CreatedAt"]
            })
    for plan in treatments_doc:
        if "CreatedAt" in plan:
            timeline_mongo.append({
                "EventType": "Treatment Plan Added",
                "Details":   plan.get("RecommendedActions", ""),
                "EventDate": plan["CreatedAt"]
            })

    timeline = sorted(
        [event for event in (timeline_mysql + timeline_mongo) if event.get("EventDate")],
        key=lambda x: x["EventDate"],
        reverse=True
    )

    return {
        "patient_info":         patient,
        "emergency_contact":    contact,
        "appointments":         appointments,
        "billing_summary":      billing_summary,
        "clinical_notes":       notes_doc,
        "diagnostic_records":   diagnostics_doc,
        "treatment_plans":      treatments_doc,
        "timeline":             timeline
    }

# ─── SCHEMAS ──────────────────────────────────────────────── Models
class PatientUpdate(BaseModel):
    PatientName: Optional[str] = None
    BirthDate: Optional[date] = None
    Sex: Optional[Literal["Male", "Female"]] = None
    BloodType: Optional[str] = None
    ContactNumber: Optional[str] = None
    PatientStatus: Optional[
        Literal["Admitted", "Discharged", "Outpatient"]
    ] = None
    RoomNum: Optional[str] = None

# ─── UPDATE ──────────────────────────────────────────────────── Modify
@router.patch("/patient/{patientid}")
def update_patient(patientid: str, payload: PatientUpdate):
    fields = payload.model_dump(exclude_unset=True)
    if not fields:
        raise HTTPException(status_code=400, detail="No fields provided to update")

    try:
        with get_cursor() as cursor:
            cursor.execute(
                "SELECT PatientID FROM Patients WHERE PatientID = %s", (patientid,)
            )
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail="Patient not found")

            if "ContactNumber" in fields:
                cursor.execute(
                    "SELECT PatientID FROM Patients WHERE ContactNumber = %s AND PatientID != %s",
                    (fields["ContactNumber"], patientid)
                )
                if cursor.fetchone():
                    raise HTTPException(status_code=400, detail="Contact number already in use")

            set_clause = ", ".join(f"{key} = %s" for key in fields.keys())
            values = list(fields.values()) + [patientid]
            cursor.execute(
                f"UPDATE Patients SET {set_clause} WHERE PatientID = %s",
                values
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {"message": f"Patient {patientid} updated successfully"}

# ─── DELETE ──────────────────────────────────────────────────── Remove
@router.delete("/patient/{patientid}", status_code=200)
def delete_patient(patientid: str):
    try:
        with get_cursor() as cursor:
            cursor.execute(
                "SELECT PatientID FROM Patients WHERE PatientID = %s", (patientid,)
            )
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail="Patient not found")

            cursor.execute(
                "DELETE FROM Emergency_Contacts WHERE PatientID = %s", (patientid,)
            )
            cursor.execute(
                "DELETE FROM Patients WHERE PatientID = %s", (patientid,)
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    try:
        mongo_db.ClinicalNotes.delete_one({"PatientID": patientid})
        mongo_db.DiagnosticRecords.delete_one({"PatientID": patientid})
        mongo_db.TreatmentPlans.delete_one({"PatientID": patientid})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"MongoDB error: {str(e)}")

    return {"message": f"Patient {patientid} and all related records deleted successfully"}
