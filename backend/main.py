from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import patient, doctor, appointment, visit, billing, medical_records

# ─── INITIALIZATION ──────────────────────────────────────────── Setup
app = FastAPI()

# ─── CORS ──────────────────────────────────────────────────────── Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── ROUTERS ──────────────────────────────────────────────────── Register
app.include_router(patient.router)
app.include_router(doctor.router)
app.include_router(appointment.router)
app.include_router(visit.router)
app.include_router(billing.router)
app.include_router(medical_records.router)

# ─── ROOT ──────────────────────────────────────────────────────── Health
@app.get("/")
def root():
    return {"message": "Patient 360 API is running"}