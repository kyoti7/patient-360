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
Project Structure

patient-360/
│
├── backend/
│   ├── databases/
│   ├── routes/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md



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
