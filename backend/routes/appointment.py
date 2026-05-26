from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime
from databases.mysql_conn import get_cursor

router = APIRouter()

# ─── SCHEMAS ──────────────────────────────────────────────── Models
class ApptCreate(BaseModel):
    PatientID:         str
    DocID:             str
    ApptDate:          datetime
    ApptStatus:        Optional[Literal["Scheduled", "Completed", "Cancelled"]] = "Scheduled"

# ─── CREATE ───────────────────────────────────────────────────── Insert
@router.post("/appointment", status_code=201)
def create_appointment(payload: ApptCreate):
    try:
        with get_cursor() as cursor:
            cursor.execute("""
                SELECT ApptID
                FROM Appointments
                ORDER BY ApptID DESC
                LIMIT 1
            """)
            last_appointment = cursor.fetchone()

            if last_appointment:
                numeric_part = ''.join(filter(str.isdigit, last_appointment["ApptID"]))
                last_id = int(numeric_part)
                new_appt_id = f"A{last_id + 1:03}"
            else:
                new_appt_id = "A001"

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
                """INSERT INTO Appointments (ApptID, PatientID, DocID, ApptDate, ApptStatus)
                VALUES (%s, %s, %s, %s, %s)""",
                (new_appt_id, payload.PatientID, payload.DocID, payload.ApptDate, payload.ApptStatus)
            )

            cursor.execute(
                "SELECT ApptStatus FROM Appointments WHERE ApptID = %s", (new_appt_id,)
            )
            final_status = cursor.fetchone()["ApptStatus"]

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    if final_status == "Cancelled":
        return {
            "message": f"Appointment {new_appt_id} was automatically cancelled because the doctor is unavailable",
            "ApptStatus": final_status
        }

    return {
        "message": f"Appointment {new_appt_id} created successfully",
        "ApptStatus": final_status
    }

# ─── READ ───────────────────────────────────────────────────── Fetch
@router.get("/appointments")
def get_appointments(
    docid:      Optional[str] = Query(None),
    status:     Optional[Literal["Scheduled", "Completed", "Cancelled"]] = Query(None),
    date_from:  Optional[datetime] = Query(None),
    date_to:    Optional[datetime] = Query(None)
):
    try:
        with get_cursor() as cursor:
            cursor.execute("SELECT COUNT(*) as total FROM Appointments")
            total = cursor.fetchone()["total"]

            cursor.execute("SELECT COUNT(*) as count FROM Appointments WHERE ApptStatus = 'Scheduled'")
            scheduled = cursor.fetchone()["count"]

            cursor.execute("SELECT COUNT(*) as count FROM Appointments WHERE ApptStatus = 'Completed'")
            completed = cursor.fetchone()["count"]

            cursor.execute("SELECT COUNT(*) as count FROM Appointments WHERE ApptStatus = 'Cancelled'")
            cancelled = cursor.fetchone()["count"]

            query = """
                SELECT a.ApptID, a.PatientID, p.PatientName,
                a.DocID, d.DocName, a.ApptDate,
                a.ApptStatus, a.CreatedAt
                FROM Appointments a
                JOIN Patients p ON a.PatientID = p.PatientID
                JOIN Doctors d ON a.DocID = d.DocID
                WHERE 1=1
            """
            params = []

            if docid:
                query += " AND a.DocID = %s"
                params.append(docid)

            if status:
                query += " AND a.ApptStatus = %s"
                params.append(status)

            if date_from:
                query += " AND a.ApptDate >= %s"
                params.append(date_from)

            if date_to:
                query += " AND a.ApptDate <= %s"
                params.append(date_to)

            query += " ORDER BY a.ApptDate DESC"
            cursor.execute(query, params)
            appointments = cursor.fetchall()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {
        "summary": {
            "total":     total,
            "scheduled": scheduled,
            "completed": completed,
            "cancelled": cancelled
        },
        "appointments": appointments
    }

# ─── SINGLE ──────────────────────────────────────────────────── Detail
@router.get("/appointment/{apptid}")
def get_appointment(apptid: str):
    try:
        with get_cursor() as cursor:
            cursor.execute("""
                SELECT a.ApptID, a.PatientID, p.PatientName,
                a.DocID, d.DocName, a.ApptDate,
                a.ApptStatus, a.CreatedAt
                FROM Appointments a
                JOIN Patients p ON a.PatientID = p.PatientID
                JOIN Doctors d ON a.DocID = d.DocID
                WHERE a.ApptID = %s
            """, (apptid,))
            appointment = cursor.fetchone()

            if not appointment:
                raise HTTPException(status_code=404, detail="Appointment not found")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {"appointment": appointment}

# ─── SCHEMAS ──────────────────────────────────────────────── Models
class ApptUpdate(BaseModel):
    ApptDate:       Optional[str] = None
    ApptStatus:     Optional[Literal["Scheduled", "Completed", "Cancelled"]] = None

# ─── UPDATE ──────────────────────────────────────────────────── Modify
@router.patch("/appointment/{apptid}")
def update_appointment(apptid: str, payload: ApptUpdate):
    fields = payload.model_dump(exclude_unset=True)
    if not fields:
        raise HTTPException(status_code=400, detail="No fields provided to update")

    try:
        with get_cursor() as cursor:
            cursor.execute(
                "SELECT ApptID FROM Appointments WHERE ApptID = %s", (apptid,)
            )
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail="Appointment not found")

            set_clause = ", ".join(f"{key} = %s" for key in fields.keys())
            values = list(fields.values()) + [apptid]
            cursor.execute(
                f"UPDATE Appointments SET {set_clause} WHERE ApptID = %s",
                values
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {"message": f"Appointment {apptid} updated successfully"}

# ─── DELETE ──────────────────────────────────────────────────── Remove
@router.delete("/appointment/{apptid}", status_code=200)
def delete_appointment(apptid: str):
    try:
        with get_cursor() as cursor:
            cursor.execute(
                "SELECT ApptID FROM Appointments WHERE ApptID = %s", (apptid,)
            )
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail="Appointment not found")

            cursor.execute(
                "DELETE FROM Appointments WHERE ApptID = %s", (apptid,)
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {"message": f"Appointment {apptid} deleted successfully"}
