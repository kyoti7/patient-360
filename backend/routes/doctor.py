from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Literal
from databases.mysql_conn import get_cursor

router = APIRouter()

# ─── SCHEMAS ──────────────────────────────────────────────── Models
class DocCreate(BaseModel):
    DocName:            str
    DeptID:             str
    DocContact_Num:     Optional[str] = None
    ConsultationFee:    Optional[float] = None
    AvailabilityStatus: Optional[Literal["Available", "Unavailable", "On Leave"]] = None

# ─── CREATE ───────────────────────────────────────────────────── Insert
@router.post("/doctor", status_code=201)
def create_doctor(payload: DocCreate):
    try:
        with get_cursor() as cursor:
            cursor.execute("""
                SELECT DocID
                FROM Doctors
                ORDER BY CAST(SUBSTRING(DocID, 4) AS UNSIGNED) DESC
                LIMIT 1
            """)
            last_doctor = cursor.fetchone()

            if last_doctor:
                last_num = int(last_doctor["DocID"][3:])
                new_doc_id = f"DOC{last_num + 1:02}"
            else:
                new_doc_id = "DOC01"

            cursor.execute(
                "SELECT DeptID FROM Departments WHERE DeptID = %s",
                (payload.DeptID,)
            )

            if not cursor.fetchone():
                raise HTTPException(
                    status_code=404,
                    detail="Department not found"
                )

            if payload.DocContact_Num:
                cursor.execute(
                    "SELECT DocID FROM Doctors WHERE DocContact_Num = %s",
                    (payload.DocContact_Num,)
                )

                if cursor.fetchone():
                    raise HTTPException(
                        status_code=400,
                        detail="Contact number already in use"
                    )

            cursor.execute(
                """
                INSERT INTO Doctors
                (
                    DocID,
                    DocName,
                    DeptID,
                    DocContact_Num,
                    ConsultationFee,
                    AvailabilityStatus
                )
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (
                    new_doc_id,
                    payload.DocName,
                    payload.DeptID,
                    payload.DocContact_Num,
                    payload.ConsultationFee,
                    payload.AvailabilityStatus
                )
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {
        "message": f"Doctor {new_doc_id} created successfully"
    }

# ─── READ ───────────────────────────────────────────────────── Fetch
@router.get("/doctors")
def get_doctors():
    try:
        with get_cursor() as cursor:
            cursor.execute("""
                SELECT d.DocID, d.DocName, d.DeptID, dept.DeptName,
                    d.DocContact_Num, d.ConsultationFee, d.AvailabilityStatus
                FROM Doctors d
                JOIN Departments dept ON d.DeptID = dept.DeptID
                ORDER BY d.DocName ASC
            """)
            doctors = cursor.fetchall()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {"doctors": doctors}

# ─── SINGLE ──────────────────────────────────────────────────── Detail
@router.get("/doctor/{docid}")
def get_doctor(docid: str):
    try:
        with get_cursor() as cursor:
            cursor.execute(
                "SELECT * FROM Doctors WHERE DocID = %s", (docid,)
            )
            doctor = cursor.fetchone()

            if not doctor:
                raise HTTPException(status_code=404, detail="Doctor not found")

            cursor.execute(
                "SELECT * FROM Appointments WHERE DocID = %s", (docid,)
            )
            appointment = cursor.fetchall()

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {
        "doctor_info": doctor,
        "appointments": appointment
    }

# ─── SCHEMAS ──────────────────────────────────────────────── Models
class DocUpdate(BaseModel):
    DocName:            Optional[str] = None
    DocContact_Num:     Optional[str] = None
    ConsultationFee:    Optional[float] = None
    AvailabilityStatus: Optional[Literal["Available", "Unavailable", "On Leave"]] = None

# ─── UPDATE ──────────────────────────────────────────────────── Modify
@router.patch("/doctor/{docid}")
def update_doctor(docid: str, payload: DocUpdate):
    fields = payload.model_dump(exclude_unset=True)
    if not fields:
        raise HTTPException(status_code=400, detail="No fields provided to update")

    try:
        with get_cursor() as cursor:
            if "DocContact_Num" in fields:
                cursor.execute(
                    "SELECT DocID FROM Doctors WHERE DocContact_Num = %s AND DocID != %s",
                    (fields["DocContact_Num"], docid)
                )
                if cursor.fetchone():
                    raise HTTPException(status_code=400, detail="Contact number already in use")

            set_clause = ", ".join(f"{key} = %s" for key in fields.keys())
            values = list(fields.values()) + [docid]
            cursor.execute(
                f"UPDATE Doctors SET {set_clause} WHERE DocID = %s",
                values
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {"message": f"Doctor {docid} updated successfully"}

# ─── DELETE ──────────────────────────────────────────────────── Remove
@router.delete("/doctor/{docid}", status_code=200)
def delete_doctor(docid: str):
    try:
        with get_cursor() as cursor:
            cursor.execute(
                "SELECT DocID FROM Doctors WHERE DocID = %s", (docid,)
            )
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail="Doctor not found")

            cursor.execute(
                "DELETE FROM Doctors WHERE DocID = %s", (docid,)
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {"message": f"Doctor {docid} deleted successfully"}
