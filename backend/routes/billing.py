from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime
from databases.mysql_conn import get_cursor

router = APIRouter()

# ─── SCHEMAS ──────────────────────────────────────────────── Models
class BillingCreate(BaseModel):
    VisitID: str
    PatientID: str
    TotalAmount: Optional[float] = None
    PaymentStatus: Optional[
        Literal["Paid", "Pending", "Partially Paid"]
    ] = None
    BillingDate: datetime

# ─── CREATE ───────────────────────────────────────────────────── Insert
@router.post("/billing", status_code=201)
def create_billing(payload: BillingCreate):
    try:
        with get_cursor() as cursor:
            cursor.execute("""
                SELECT BillingID
                FROM Billing
                ORDER BY CAST(SUBSTRING(BillingID, 4) AS UNSIGNED) DESC
                LIMIT 1
            """)
            last_billing = cursor.fetchone()

            if last_billing:
                last_num = int(last_billing["BillingID"][3:])
                new_billing_id = f"BIL{last_num + 1:02}"
            else:
                new_billing_id = "BIL01"

            cursor.execute(
                "SELECT VisitID FROM Visits WHERE VisitID = %s",
                (payload.VisitID,)
            )

            if not cursor.fetchone():
                raise HTTPException(
                    status_code=404,
                    detail="Visit not found"
                )

            cursor.execute(
                "SELECT PatientID FROM Patients WHERE PatientID = %s",
                (payload.PatientID,)
            )

            if not cursor.fetchone():
                raise HTTPException(
                    status_code=404,
                    detail="Patient not found"
                )

            cursor.execute(
                """
                INSERT INTO Billing (
                    BillingID,
                    VisitID,
                    PatientID,
                    TotalAmount,
                    PaymentStatus,
                    BillingDate
                )
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (
                    new_billing_id,
                    payload.VisitID,
                    payload.PatientID,
                    payload.TotalAmount,
                    payload.PaymentStatus,
                    payload.BillingDate
                )
            )

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Database error")

    return {
        "message": f"Billing {new_billing_id} created successfully"
    }

# ─── SINGLE ──────────────────────────────────────────────────── Detail
@router.get("/billing/{billingid}")
def get_billing(billingid: str):
    try:
        with get_cursor() as cursor:
            cursor.execute(
                "SELECT * FROM Billing WHERE BillingID = %s",
                (billingid,)
            )
            billing = cursor.fetchone()

            if not billing:
                raise HTTPException(
                    status_code=404,
                    detail="Billing not found"
                )

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Database error")

    return {
        "billing_info": billing
    }

# ─── READ ───────────────────────────────────────────────────── Fetch
@router.get("/billings")
def get_billings():
    try:
        with get_cursor() as cursor:
            cursor.execute("""
                SELECT
                    b.BillingID,
                    b.VisitID,
                    b.PatientID,
                    p.PatientName,
                    b.TotalAmount,
                    b.PaymentStatus,
                    b.BillingDate
                FROM Billing b
                JOIN Patients p
                    ON b.PatientID = p.PatientID
                ORDER BY b.BillingDate DESC
            """)
            billings = cursor.fetchall()

    except Exception:
        raise HTTPException(status_code=500, detail="Database error")

    return {
        "billings": billings
    }

# ─── SCHEMAS ──────────────────────────────────────────────── Models
class BillingUpdate(BaseModel):
    PaymentStatus: Optional[
        Literal["Paid", "Pending", "Partially Paid"]
    ] = None
    BillingDate: Optional[datetime] = None

# ─── UPDATE ──────────────────────────────────────────────────── Modify
@router.patch("/billing/{billingid}")
def update_billing(billingid: str, payload: BillingUpdate):
    fields = payload.model_dump(exclude_unset=True)

    if not fields:
        raise HTTPException(
            status_code=400,
            detail="No fields provided to update"
        )

    try:
        with get_cursor() as cursor:
            cursor.execute(
                "SELECT BillingID FROM Billing WHERE BillingID = %s",
                (billingid,)
            )

            if not cursor.fetchone():
                raise HTTPException(
                    status_code=404,
                    detail="Billing not found"
                )

            set_clause = ", ".join(
                f"{key} = %s" for key in fields.keys()
            )

            values = list(fields.values()) + [billingid]
            cursor.execute(
                f"UPDATE Billing SET {set_clause} WHERE BillingID = %s",
                values
            )

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Database error")

    return {
        "message": f"Billing {billingid} updated successfully"
    }

# ─── DELETE ──────────────────────────────────────────────────── Remove
@router.delete("/billing/{billingid}")
def delete_billing(billingid: str):
    try:
        with get_cursor() as cursor:
            cursor.execute(
                "SELECT BillingID FROM Billing WHERE BillingID = %s",
                (billingid,)
            )

            if not cursor.fetchone():
                raise HTTPException(
                    status_code=404,
                    detail="Billing not found"
                )

            cursor.execute(
                "DELETE FROM Billing WHERE BillingID = %s",
                (billingid,)
            )

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Database error")

    return {
        "message": f"Billing {billingid} deleted successfully"
    }
