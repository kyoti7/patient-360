# Patient 360

A full-stack healthcare management system

---

# Tech Stack

## Frontend
* React JS
* Vite
* Axios

## Backend
* FastAPI

## Database
* MySQL
* MongoDB

---

# Software Requirements

Install the following before running the project:

* Node.js v22.14.0
* Python 3.14.5
* Git
* MySQL Workbench or MySQL Server
* MongoDB Compass or MongoDB Community Server
* Visual Studio Code

---

# Installation Guide

---

## Clone the Repository

```bash
git clone <repository-url>
cd patient-360
```

---

# Database Setup

Before running the project, import the provided dataset files into your local database systems.

---

## MySQL Setup

Open MySQL Workbench

Create a database named:

```sql
CREATE DATABASE patient360;
```

Import the provided MySQL dataset file into the patient360 database.

---

## MongoDB Setup

Open MongoDB Compass

Create or use the database:

```txt
Patient_360
```

Import the provided MongoDB dataset/collections.

---

# Backend Setup

## 2. Create Virtual Environment

```bash
cd backend
python -m venv .venv
```

---

## 3. Activate Virtual Environment

```bash
.venv\Scripts\activate
```

---

## 4. Install Backend Dependencies

```bash
pip install fastapi
pip install uvicorn
pip install mysql-connector-python
pip install pymongo
```

---

## 5. Configure Database Connection

Update the database configuration inside:

```txt
backend/databases/mysql_conn.py
```

and

```txt
backend/databases/mongodb_conn.py
```

Configure your local database credentials before running the backend server.

---

## 6. Run Backend Server

```bash
uvicorn main:app --reload
```

Backend API URL:

```txt
http://localhost:8000
```

---

## 7. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 8. Run Frontend

```bash
npm run dev
```

Frontend URL:

```txt
http://localhost:5173
```

---

# Project Structure

```txt
patient-360/
│
├── backend/
│   ├── __pycache__/
│   │
│   ├── databases/
│   │   ├── __pycache__/
│   │   ├── mongodb_conn.py
│   │   └── mysql_conn.py
│   │
│   ├── routes/
│   │   ├── __pycache__/
│   │   ├── appointment.py
│   │   ├── billing.py
│   │   ├── doctor.py
│   │   ├── medical_records.py
│   │   ├── patient.py
│   │   └── visit.py
│   │
│   └── main.py
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   ├── logo.png
│   │   │   └── vite.svg
│   │   │
│   │   ├── components/
│   │   │   ├── css/
│   │   │   │   ├── Button.css
│   │   │   │   ├── DashboardCards.css
│   │   │   │   ├── Layout.css
│   │   │   │   ├── Modal.css
│   │   │   │   ├── Navbar.css
│   │   │   │   ├── SearchInput.css
│   │   │   │   ├── Sidebar.css
│   │   │   │   ├── StatusBadge.css
│   │   │   │   └── Table.css
│   │   │   │
│   │   │   └── ui/
│   │   │       ├── Button.jsx
│   │   │       ├── Card.jsx
│   │   │       ├── Modal.jsx
│   │   │       ├── Navbar.jsx
│   │   │       ├── SearchInput.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       ├── StatusBadge.jsx
│   │   │       └── Table.jsx
│   │   │
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── css/
│   │   │   │   ├── Appointments/
│   │   │   │   │   ├── AddAppointmentModal.css
│   │   │   │   │   ├── Appointments.css
│   │   │   │   │   ├── DeleteAppointmentModal.css
│   │   │   │   │   └── EditAppointmentModal.css
│   │   │   │   │
│   │   │   │   ├── Billing/
│   │   │   │   │   ├── AddBillingModal.css
│   │   │   │   │   ├── Billing.css
│   │   │   │   │   ├── DeleteBillingModal.css
│   │   │   │   │   └── EditBillingModal.css
│   │   │   │   │
│   │   │   │   ├── Dashboard/
│   │   │   │   │   └── Dashboard.css
│   │   │   │   │
│   │   │   │   ├── Doctors/
│   │   │   │   │   ├── AddDoctorModal.css
│   │   │   │   │   ├── DeleteDoctorModal.css
│   │   │   │   │   ├── Doctors.css
│   │   │   │   │   └── EditDoctorModal.css
│   │   │   │   │
│   │   │   │   ├── Patients/
│   │   │   │   │   ├── AddPatientModal.css
│   │   │   │   │   ├── DeletePatientModal.css
│   │   │   │   │   ├── EditPatientModal.css
│   │   │   │   │   ├── MedicalRecordsModal.css
│   │   │   │   │   ├── PatientDetailsModal.css
│   │   │   │   │   └── Patients.css
│   │   │   │   │
│   │   │   │   └── Visits/
│   │   │   │       ├── AddVisitModal.css
│   │   │   │       ├── DeleteVisitModal.css
│   │   │   │       ├── EditVisitModal.css
│   │   │   │       └── Visits.css
│   │   │   │
│   │   │   ├── modal/
│   │   │   │   ├── Appointments/
│   │   │   │   │   ├── AddAppointmentModal.jsx
│   │   │   │   │   ├── DeleteAppointmentModal.jsx
│   │   │   │   │   └── EditAppointmentModal.jsx
│   │   │   │   │
│   │   │   │   ├── Billing/
│   │   │   │   │   ├── AddBillingModal.jsx
│   │   │   │   │   ├── DeleteBillingModal.jsx
│   │   │   │   │   └── EditBillingModal.jsx
│   │   │   │   │
│   │   │   │   ├── Doctors/
│   │   │   │   │   ├── AddDoctorModal.jsx
│   │   │   │   │   ├── DeleteDoctorModal.jsx
│   │   │   │   │   └── EditDoctorModal.jsx
│   │   │   │   │
│   │   │   │   ├── Patients/
│   │   │   │   │   ├── AddPatientModal.jsx
│   │   │   │   │   ├── DeletePatientModal.jsx
│   │   │   │   │   ├── EditPatientModal.jsx
│   │   │   │   │   ├── MedicalRecordsModal.jsx
│   │   │   │   │   └── PatientDetailsModal.jsx
│   │   │   │   │
│   │   │   │   └── Visits/
│   │   │   │       ├── AddVisitModal.jsx
│   │   │   │       ├── DeleteVisitModal.jsx
│   │   │   │       └── EditVisitModal.jsx
│   │   │   │
│   │   │   ├── Appointments.jsx
│   │   │   ├── Billing.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Doctors.jsx
│   │   │   ├── Patients.jsx
│   │   │   └── Visits.jsx
│   │   │
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.jsx
│   │   │   ├── appointmentService.js
│   │   │   ├── billingService.js
│   │   │   ├── doctorService.js
│   │   │   ├── medicalRecordService.js
│   │   │   ├── patientService.js
│   │   │   └── visitService.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```




## Snippets

### FastAPI Application Initialization

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import patient, doctor, appointment, visit, billing, medical_records

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(patient.router)
app.include_router(doctor.router)
app.include_router(appointment.router)
app.include_router(visit.router)
app.include_router(billing.router)
app.include_router(medical_records.router)
```

This initializes the FastAPI backend server and registers all API routes used in the system. The CORS middleware also allows the React frontend to communicate with the backend properly.

---

### MySQL Database Connection Pool

```python
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "12345",
    "database": "patient360",
}

connection_pool = pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=5,
    **db_config
)
```

This creates a MySQL connection pool for handling multiple database requests efficiently. Instead of opening a new connection every time, the system reuses existing connections to improve performance.

---

### MongoDB Connection

```python
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
mongo_db = client["Patient_360"]
```

This connects the backend application to MongoDB. MongoDB is used for storing flexible medical documents such as clinical notes, diagnostic records, and treatment plans.

---

### Patient Creation API Endpoint

```python
@router.post("/patient", status_code=201)
def create_patient(payload: PatientCreate):
    with get_cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO Patients
            (
                PatientID,
                PatientName,
                BirthDate
            )
            VALUES (%s, %s, %s)
            """,
            (
                new_patient_id,
                payload.PatientName,
                payload.BirthDate
            )
        )
```

This API endpoint inserts a new patient record into the MySQL database. It handles patient registration and stores important patient information inside the system.

---

### Unified Patient Medical Timeline

```python
timeline = sorted(
    [event for event in (timeline_mysql + timeline_mongo)
     if event.get("EventDate")],
    key=lambda x: x["EventDate"],
    reverse=True
)
```

This combines patient events coming from both MySQL and MongoDB into one timeline. It helps organize appointments, billing records, visits, and medical documents in chronological order.

---

### MongoDB Clinical Notes API

```python
@router.post("/clinical-notes", status_code=201)
async def create_clinical_note(payload: ClinicalNoteCreate):
    note = payload.model_dump()
    note["CreatedAt"] = datetime.utcnow()
    mongo_db.ClinicalNotes.insert_one(note)
```

This endpoint stores clinical notes inside MongoDB. It is used for handling unstructured medical data such as diagnoses, symptoms, prescriptions, and doctor notes.

---

### Axios API Client Configuration

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});
```

This configures the Axios client used by the React frontend. It centralizes API communication between the frontend and backend server.

---

### Frontend Patient Service Layer

```javascript
export const getPatients = async () => {
  const response = await api.get("/patients");
  return response.data;
};

export const createPatient = async (payload) => {
  const response = await api.post("/patient", payload);
  return response.data;
};
```

This service layer handles API requests related to patient management. It keeps the frontend code cleaner and separates API logic from UI components.

---

### React Application Routing

```javascript
<Routes>
  <Route path="/" element={<MainLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="patients" element={<Patients />} />
    <Route path="appointments" element={<Appointments />} />
  </Route>
</Routes>
```

This defines the navigation structure of the React application using React Router. It allows users to move between pages such as Dashboard, Patients, and Appointments.

---

### Dashboard Analytics Logic

```javascript
const todayAppointments = appointments.filter((appt) => {
  const today = new Date().toISOString().split("T")[0];
  return new Date(appt.ApptDate).toISOString().split("T")[0] === today;
});
```

This filters appointment records to display only the appointments scheduled for the current day. The result is used for real-time dashboard statistics and monitoring.
