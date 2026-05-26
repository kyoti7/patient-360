import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import { getPatients } from "../services/patientService";
import { getAppointments } from "../services/appointmentService";
import { getVisits } from "../services/visitService";
import { getBillings } from "../services/billingService";
import { getDoctors } from "../services/doctorService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./css/Dashboard/Dashboard.css";

// ─── MAIN ──────────────────────────────────────────────────── Display
function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [visits, setVisits] = useState([]);
  const [billings, setBillings] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // ─── FETCH ──────────────────────────────────────────────── Data
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const patientData = await getPatients();
        setPatients(patientData.patients || []);
      } catch (error) {
        console.log("Patients error:", error);
      }

      try {
        const appointmentData = await getAppointments();
        setAppointments(appointmentData.appointments || []);
      } catch (error) {
        console.log("Appointments error:", error);
      }

      try {
        const visitData = await getVisits();
        setVisits(visitData.visits || []);
      } catch (error) {
        console.log("Visits error:", error);
      }

      try {
        const billingData = await getBillings();
        setBillings(billingData.billings || []);
      } catch (error) {
        console.log("Billings error:", error);
      }

      try {
        const doctorData = await getDoctors();
        setDoctors(doctorData.doctors || []);
      } catch (error) {
        console.log("Doctors error:", error);
      }
    };

    loadDashboard();
  }, []);

  // ─── FILTERS ────────────────────────────────────────────── Logic
  const todayAppointments = appointments.filter((appt) => {
    const today = new Date().toISOString().split("T")[0];
    return new Date(appt.ApptDate).toISOString().split("T")[0] === today;
  });

  const ongoingVisits = visits.filter(
    (visit) => visit.VisitStatus === "Ongoing",
  );

  const pendingBills = billings.filter(
    (bill) => bill.PaymentStatus === "Pending",
  );

  const emergencyCases = visits.filter(
    (visit) => visit.VisitType === "Emergency",
  );

  // ─── TRENDS ────────────────────────────────────────────── Transform
  const appointmentTrendData = appointments.reduce((acc, appt) => {
    const date = new Date(appt.ApptDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const existing = acc.find((item) => item.day === date);

    if (existing) {
      existing.value += 1;
    } else {
      acc.push({
        day: date,
        value: 1,
      });
    }

    return acc;
  }, []);

  const departmentData = doctors.reduce((acc, doctor) => {
    const existing = acc.find((item) => item.name === doctor.DeptName);

    if (existing) {
      existing.value += 1;
    } else {
      acc.push({
        name: doctor.DeptName || "Unknown",
        value: 1,
      });
    }

    return acc;
  }, []);

  const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#f59e0b"];

  // ─── RENDER ────────────────────────────────────────────── Display
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Hospital overview and operational metrics
          </p>
        </div>
      </div>

      <div className="dashboard-cards">
        <Card
          title="Total Patients"
          value={patients.length}
          subtitle="Registered patients"
        />

        <Card
          title="Today's Appointments"
          value={todayAppointments.length}
          subtitle="Scheduled today"
        />

        <Card
          title="Ongoing Visits"
          value={ongoingVisits.length}
          subtitle="Active visits"
        />

        <Card
          title="Pending Billing"
          value={pendingBills.length}
          subtitle="Unpaid bills"
        />

        <Card
          title="Emergency Cases"
          value={emergencyCases.length}
          subtitle="Critical visits"
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-chart-card">
          <h3>Appointment Trends</h3>
          <ResponsiveContainer width="100%" height={420}>
            <LineChart
              data={appointmentTrendData}
              margin={{
                top: 20,
                right: 20,
                left: -10,
                bottom: 5,
              }}
            >
              <XAxis dataKey="day" />
              <YAxis domain={[0, 40]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={4}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-right-column">
          <div className="dashboard-chart-card pie-card">
            <h3>Department Distribution</h3>

            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={departmentData}
                  dataKey="value"
                  outerRadius={90}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-mini-card">
            <h3>Quick Stats</h3>

            <div className="mini-stat">
              <span>Total Appointments</span>
              <strong>{appointments.length}</strong>
            </div>

            <div className="mini-stat">
              <span>Total Visits</span>
              <strong>{visits.length}</strong>
            </div>

            <div className="mini-stat">
              <span>Total Bills</span>
              <strong>{billings.length}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
