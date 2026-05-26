from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime
from databases.mysql_conn import get_cursor

router = APIRouter()

# ─── SCHEMAS ──────────────────────────────────────────────── Models
class VisitCreate(BaseModel):
    VisitID:           str
    PatientID:         str
    DocID:             str
    ApptID:            str
    VisitDate:         datetime
    VisitType:         Optional[Literal["Routine Checkup","Follow Up","Emergency","Consultation"]] = None
    VisitStatus:       Optional[Literal["Ongoing", "Completed"]] = None
    RoomNum:           Optional[str]= None

class VisitUpdate(BaseModel):
    VisitDate:         Optional[datetime] = None
    VisitType:         Optional[Literal["Routine Checkup","Follow Up","Emergency","Consultation"]] = None
    VisitStatus:       Optional[Literal["Ongoing", "Completed"]] = None
    RoomNum:           Optional[str] = None

# ─── CREATE ───────────────────────────────────────────────────── Insert
@router.post("/visit", status_code=201)
def create_visit(payload: VisitCreate):
    try:
        with get_cursor() as cursor:
            cursor.execute(
                "SELECT VisitID FROM Visits WHERE VisitID = %s", (payload.VisitID,)
            )
            if cursor.fetchone():
                raise HTTPException(status_code=400, detail="Visit already exists")

            cursor.execute(
                "SELECT PatientID FROM Patients WHERE PatientID = %s",
                (payload.PatientID,)
            )
            if not cursor.fetchone():
                raise HTTPException(status_code=400, detail="Patient not found.")

            cursor.execute(
                "SELECT DocID FROM Doctors WHERE DocID = %s", (payload.DocID,)
            )
            if not cursor.fetchone():
                raise HTTPException(status_code=400, detail="Doctor not found")

            cursor.execute(
                "SELECT ApptID FROM Appointments WHERE ApptID = %s", (payload.ApptID,)
            )
            if not cursor.fetchone():
                raise HTTPException(status_code=400, detail="Appointment not found")

            cursor.execute(
                """INSERT INTO Visits (VisitID, PatientID, DocID, ApptID, VisitDate, VisitType, VisitStatus, RoomNum)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
                (payload.VisitID, payload.PatientID, payload.DocID, payload.ApptID, payload.VisitDate, payload.VisitType, payload.VisitStatus, payload.RoomNum)
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {
        "message": f"Visit {payload.VisitID} created successfully"
    }

# ─── READ ───────────────────────────────────────────────────── Fetch
@router.get("/visits")
def get_visits(
    docid:      Optional[str] = Query(None),
    visittype:  Optional[Literal["Routine Checkup","Follow Up","Emergency","Consultation"]] = Query(None),
    status:     Optional[Literal["Ongoing", "Completed"]] = Query(None),
    date_from:  Optional[datetime] = Query(None),
    date_to:    Optional[datetime] = Query(None)
):
    try:
        with get_cursor() as cursor:
            cursor.execute("SELECT COUNT(*) as total FROM Visits")
            total = cursor.fetchone()["total"]

            cursor.execute("SELECT COUNT(*) as count FROM Visits WHERE VisitStatus = 'Ongoing'")
            ongoing = cursor.fetchone()["count"]

            cursor.execute("SELECT COUNT(*) as count FROM Visits WHERE VisitStatus = 'Completed'")
            completed = cursor.fetchone()["count"]

            cursor.execute("SELECT COUNT(*) as count FROM Visits WHERE VisitType = 'Emergency'")
            emergency = cursor.fetchone()["count"]

            query = """
                SELECT v.VisitID, v.PatientID, p.PatientName,
                        v.DocID, d.DocName, v.ApptID, v.VisitDate,
                        v.VisitType, v.VisitStatus, v.RoomNum
                FROM Visits v
                JOIN Patients p ON v.PatientID = p.PatientID
                JOIN Doctors d ON v.DocID = d.DocID
                WHERE 1=1
            """
            params = []

            if docid:
                query += " AND v.DocID = %s"
                params.append(docid)

            if visittype:
                query += " AND v.VisitType = %s"
                params.append(visittype)

            if status:
                query += " AND v.VisitStatus = %s"
                params.append(status)

            if date_from:
                query += " AND v.VisitDate >= %s"
                params.append(date_from)

            if date_to:
                query += " AND v.VisitDate <= %s"
                params.append(date_to)

            query += " ORDER BY v.VisitDate DESC"
            cursor.execute(query, params)
            visit = cursor.fetchall()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {
        "summary": {
            "total":        total,
            "ongoing":      ongoing,
            "completed":    completed,
            "emergency":    emergency
        },
        "visits": visit
    }

# ─── SINGLE ──────────────────────────────────────────────────── Detail
@router.get("/visit/{visitid}")
def get_visit(visitid: str):
    try:
        with get_cursor() as cursor:
            cursor.execute("""
                SELECT v.VisitID, v.PatientID, p.PatientName,
                        v.DocID, d.DocName, v.ApptID,
                        v.VisitDate, v.VisitType, v.VisitStatus, v.RoomNum
                FROM Visits v
                JOIN Patients p ON v.PatientID = p.PatientID
                JOIN Doctors d ON v.DocID = d.DocID
                WHERE v.VisitID = %s
            """, (visitid,))
            visit = cursor.fetchone()

            if not visit:
                raise HTTPException(status_code=404, detail="Visit not found")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {"visit": visit}

# ─── UPDATE ──────────────────────────────────────────────────── Modify
@router.patch("/visit/{visitid}")
def update_visit(visitid: str, payload: VisitUpdate):
    fields = payload.model_dump(exclude_unset=True)
    if not fields:
        raise HTTPException(status_code=400, detail="No fields provided to update")

    try:
        with get_cursor() as cursor:
            cursor.execute(
                "SELECT VisitID FROM Visits WHERE VisitID = %s", (visitid,)
            )
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail="Visit not found")

            set_clause = ", ".join(f"{key} = %s" for key in fields.keys())
            values = list(fields.values()) + [visitid]
            cursor.execute(
                f"UPDATE Visits SET {set_clause} WHERE VisitID = %s",
                values
            )

            cursor.execute("""
                SELECT v.VisitStatus,
                    p.PatientStatus,
                    b.BillingID,
                    b.TotalAmount,
                    b.PaymentStatus
                FROM Visits v
                JOIN Patients p ON v.PatientID = p.PatientID
                LEFT JOIN Billing b ON v.VisitID = b.VisitID
                WHERE v.VisitID = %s
            """, (visitid,))
            final = cursor.fetchone()

            if not final:
                raise HTTPException(status_code=500, detail="Failed to retrieve updated visit")

            if final["VisitStatus"] == "Completed":
                return {
                    "message": f"Visit {visitid} marked as Completed",
                    "triggers": {
                        "patient_status": f"Patient automatically set to '{final['PatientStatus']}'",
                        "billing_created": {
                            "BillingID":     final["BillingID"],
                            "TotalAmount":   final["TotalAmount"],
                            "PaymentStatus": final["PaymentStatus"]
                        }
                    }
                }
            return {"message": f"Visit {visitid} updated successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# ─── DELETE ──────────────────────────────────────────────────── Remove
@router.delete("/visit/{visitid}", status_code=200)
def delete_visit(visitid: str):
    try:
        with get_cursor() as cursor:
            cursor.execute(
                "SELECT VisitID FROM Visits WHERE VisitID = %s", (visitid,)
            )
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail="Visit not found")

            cursor.execute(
                "DELETE FROM Visits WHERE VisitID = %s", (visitid,)
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {"message": f"Visit {visitid} deleted successfully"}
