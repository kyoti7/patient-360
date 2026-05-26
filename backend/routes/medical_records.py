# ─── MONGODB COLLECTIONS ──────────────────────────────────── Notes/Records/Plans
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from databases.mongodb_conn import mongo_db

router = APIRouter()

# ─── SCHEMAS ──────────────────────────────────────────────── Models
class ClinicalNoteCreate(BaseModel):
    PatientID:          str
    VisitID:            str
    DocID:              Optional[str] = None
    VisitDate:          Optional[datetime] = None
    CheckUp_Type:       Optional[str] = None
    ChiefComplaint:     Optional[str] = None
    Symptoms:           Optional[list[str]] = None
    Diagnosis:          Optional[str] = None
    ClinicalNotes:      Optional[str] = None
    Prescriptions:      Optional[list[str]] = None
    FollowUp_Required:  Optional[bool] = None

class ClinicalNoteUpdate(BaseModel):
    CheckUp_Type:       Optional[str] = None
    ChiefComplaint:     Optional[str] = None
    Symptoms:           Optional[list[str]] = None
    Diagnosis:          Optional[str] = None
    ClinicalNotes:      Optional[str] = None
    Prescriptions:      Optional[list[str]] = None
    FollowUp_Required:  Optional[bool] = None

# ─── CLINICAL NOTES ───────────────────────────────────────── Create
@router.post("/clinical-notes", status_code=201)
async def create_clinical_note(payload: ClinicalNoteCreate):
    existing = mongo_db.ClinicalNotes.find_one({"VisitID": payload.VisitID})
    if existing:
        raise HTTPException(status_code=400, detail = "Clinical note for this visit already exists")

    note = payload.model_dump()
    note["CreatedAt"] = datetime.utcnow()
    mongo_db.ClinicalNotes.insert_one(note)

    return {"message": f"Clinical note for Visit {payload.VisitID} created successfully"}

# ─── READ PATIENT ───────────────────────────────────────────── Fetch
@router.get("/clinical-notes/{patientid}")
def get_clinical_notes(patientid: str):
    notes = list(mongo_db.ClinicalNotes.find(
        {"PatientID": patientid}, {"_id": 0}
    ))

    return {"clinical_notes": notes}

# ─── READ SINGLE ───────────────────────────────────────────── Detail
@router.get("/clinical-notes/{patientid}/{visitid}")
def get_clinical_note(patientid: str, visitid: str):
    note = mongo_db.ClinicalNotes.find_one(
        {"PatientID": patientid, "VisitID": visitid}, {"_id": 0}
    )
    if not note:
        raise HTTPException(status_code=404, detail="Clinical note not found")

    return {"clinical_note": note}

# ─── UPDATE ──────────────────────────────────────────────────── Modify
@router.patch("/clinical-notes/{patientid}/{visitid}")
def update_clinical_note(patientid: str, visitid: str, payload: ClinicalNoteUpdate):
    fields = payload.model_dump(exclude_unset=True)
    if not fields:
        raise HTTPException(status_code=400, detail="No fields provided to update")

    result = mongo_db.ClinicalNotes.update_one(
        {"PatientID": patientid, "VisitID": visitid},
        {"$set": fields}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Clinical note not found")

    return {"message": f"Clinical note for Visit {visitid} updated successfully"}

# ─── DELETE ──────────────────────────────────────────────────── Remove
@router.delete("/clinical-notes/{patientid}/{visitid}", status_code=200)
def delete_clinical_note(patientid: str, visitid: str):
    result = mongo_db.ClinicalNotes.delete_one(
        {"PatientID": patientid, "VisitID": visitid}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Clinical note not found")

    return {"message": f"Clinical note for Visit {visitid} deleted successfully"}

# ─── SCHEMAS ──────────────────────────────────────────────── Models
class Vitals(BaseModel):
    BloodPressure: Optional[str] = None
    Temperature:   Optional[float] = None
    HeartRate:     Optional[int] = None

class DiagnosticRecordCreate(BaseModel):
    PatientID:  str
    VisitID:    str
    TestType:   Optional[str] = None
    VitalSigns: Optional[Vitals] = None
    Findings:   Optional[str] = None
    ScanResult: Optional[str] = None

class DiagnosticRecordUpdate(BaseModel):
    TestType:   Optional[str] = None
    VitalSigns: Optional[Vitals] = None
    Findings:   Optional[str] = None
    ScanResult: Optional[str] = None

# ─── DIAGNOSTIC RECORDS ───────────────────────────────────── Create
@router.post("/diagnostic-records", status_code=201)
def create_diagnostic_record(payload: DiagnosticRecordCreate):
    existing = mongo_db.DiagnosticRecords.find_one({"VisitID": payload.VisitID})
    if existing:
        raise HTTPException(status_code=400, detail="Diagnostic record for this visit already exists")

    record = payload.model_dump()
    record["CreatedAt"] = datetime.utcnow()
    mongo_db.DiagnosticRecords.insert_one(record)

    return {"message": f"Diagnostic record for Visit {payload.VisitID} created successfully"}

# ─── READ PATIENT ───────────────────────────────────────────── Fetch
@router.get("/diagnostic-records/{patientid}")
def get_diagnostic_records(patientid: str):
    records = list(mongo_db.DiagnosticRecords.find(
        {"PatientID": patientid}, {"_id": 0}
    ))

    return {"diagnostic_records": records}

# ─── READ SINGLE ───────────────────────────────────────────── Detail
@router.get("/diagnostic-records/{patientid}/{visitid}")
def get_diagnostic_record(patientid: str, visitid: str):
    record = mongo_db.DiagnosticRecords.find_one(
        {"PatientID": patientid, "VisitID": visitid}, {"_id": 0}
    )
    if not record:
        raise HTTPException(status_code=404, detail="Diagnostic record not found")

    return {"diagnostic_record": record}

# ─── UPDATE ──────────────────────────────────────────────────── Modify
@router.patch("/diagnostic-records/{patientid}/{visitid}")
def update_diagnostic_record(patientid: str, visitid: str, payload: DiagnosticRecordUpdate):
    fields = payload.model_dump(exclude_unset=True)
    if not fields:
        raise HTTPException(status_code=400, detail="No fields provided to update")

    result = mongo_db.DiagnosticRecords.update_one(
        {"PatientID": patientid, "VisitID": visitid},
        {"$set": fields}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Diagnostic record not found")

    return {"message": f"Diagnostic record for Visit {visitid} updated successfully"}

# ─── DELETE ──────────────────────────────────────────────────── Remove
@router.delete("/diagnostic-records/{patientid}/{visitid}", status_code=200)
def delete_diagnostic_record(patientid: str, visitid: str):
    result = mongo_db.DiagnosticRecords.delete_one(
        {"PatientID": patientid, "VisitID": visitid}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Diagnostic record not found")

    return {"message": f"Diagnostic record for Visit {visitid} deleted successfully"}

# ─── SCHEMAS ──────────────────────────────────────────────── Models
class Medication(BaseModel):
    Name:      str
    Dosage:    str
    Frequency: str

class TreatmentPlanCreate(BaseModel):
    PatientID:          str
    VisitID:            str
    DocID:              Optional[str] = None
    RecommendedActions: Optional[list[str]] = None
    Medications:        Optional[list[Medication]] = None
    FollowUp_Date:      Optional[datetime] = None

class TreatmentPlanUpdate(BaseModel):
    RecommendedActions: Optional[list[str]] = None
    Medications:        Optional[list[Medication]] = None
    FollowUp_Date:      Optional[datetime] = None

# ─── TREATMENT PLANS ──────────────────────────────────────── Create
@router.post("/treatment-plans", status_code=201)
def create_treatment_plan(payload: TreatmentPlanCreate):
    existing = mongo_db.TreatmentPlans.find_one({"VisitID": payload.VisitID})
    if existing:
        raise HTTPException(status_code=400, detail="Treatment plan for this visit already exists")

    plan = payload.model_dump()
    plan["CreatedAt"] = datetime.utcnow()
    mongo_db.TreatmentPlans.insert_one(plan)

    return {"message": f"Treatment plan for Visit {payload.VisitID} created successfully"}

# ─── READ PATIENT ───────────────────────────────────────────── Fetch
@router.get("/treatment-plans/{patientid}")
def get_treatment_plans(patientid: str):
    plans = list(mongo_db.TreatmentPlans.find(
        {"PatientID": patientid}, {"_id": 0}
    ))

    return {"treatment_plans": plans}

# ─── READ SINGLE ───────────────────────────────────────────── Detail
@router.get("/treatment-plans/{patientid}/{visitid}")
def get_treatment_plan(patientid: str, visitid: str):
    plan = mongo_db.TreatmentPlans.find_one(
        {"PatientID": patientid, "VisitID": visitid}, {"_id": 0}
    )
    if not plan:
        raise HTTPException(status_code=404, detail="Treatment plan not found")

    return {"treatment_plan": plan}

# ─── UPDATE ──────────────────────────────────────────────────── Modify
@router.patch("/treatment-plans/{patientid}/{visitid}")
def update_treatment_plan(patientid: str, visitid: str, payload: TreatmentPlanUpdate):
    fields = payload.model_dump(exclude_unset=True)
    if not fields:
        raise HTTPException(status_code=400, detail="No fields provided to update")

    result = mongo_db.TreatmentPlans.update_one(
        {"PatientID": patientid, "VisitID": visitid},
        {"$set": fields}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Treatment plan not found")

    return {"message": f"Treatment plan for Visit {visitid} updated successfully"}

# ─── DELETE ──────────────────────────────────────────────────── Remove
@router.delete("/treatment-plans/{patientid}/{visitid}", status_code=200)
def delete_treatment_plan(patientid: str, visitid: str):
    result = mongo_db.TreatmentPlans.delete_one(
        {"PatientID": patientid, "VisitID": visitid}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Treatment plan not found")

    return {"message": f"Treatment plan for Visit {visitid} deleted successfully"}
