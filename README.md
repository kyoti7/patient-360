Patient 360
A full-stack healthcare management system
---
Tech Stack
Frontend
* React JS
* Vite
* Axios

Backend
* FastAPI

Database
* MySQL
* MongoDB
---
Software Requirements

Install the following before running the project:

Node.js v22.14.0
Python 3.14.5
Git
MySQL Workbench or MySQL Server
MongoDB Compass or MongoDB Community Server
Visual Studio Code
---
Installation Guide
---
Clone the Repository
git clone <repository-url>
cd patient-360
---
Database Setup
Before running the project, import the provided dataset files into your local database systems.
---
MySQL Setup
Open MySQL Workbench

Create a database named:
CREATE DATABASE patient360;

Import the provided MySQL dataset file into the patient360 database.
---
MongoDB Setup
Open MongoDB Compass

Create or use the database:
Patient_360

Import the provided MongoDB dataset/collections.
---
Backend Setup
2. Create Virtual Environment
cd backend
python -m venv .venv

3. Activate Virtual Environment
.venv\Scripts\activate

4. Install Backend Dependencies
pip install fastapi
pip install uvicorn
pip install mysql-connector-python
pip install pymongo

5. Configure Database Connection

Update the database configuration inside:
backend/databases/mysql_conn.py
and
backend/databases/mongodb_conn.py

Configure your local database credentials before running the backend server.

6. Run Backend Server
uvicorn main:app --reload

Backend API URL:
http://localhost:8000

7. Install Frontend Dependencies
cd frontend
npm install

8. Run Frontend
npm run dev

Frontend URL:
http://localhost:5173



Project Structure

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
│   │   │   │   ├── Billing/
│   │   │   │   ├── Dashboard/
│   │   │   │   ├── Doctors/
│   │   │   │   ├── Patients/
│   │   │   │   └── Visits/
│   │   │   │
│   │   │   ├── modal/
│   │   │   │   ├── Appointments/
│   │   │   │   ├── Billing/
│   │   │   │   ├── Doctors/
│   │   │   │   ├── Patients/
│   │   │   │   └── Visits/
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
