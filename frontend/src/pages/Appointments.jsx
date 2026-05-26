import { useEffect, useState } from "react";
import SearchInput from "../components/ui/SearchInput";
import StatusBadge from "../components/ui/StatusBadge";
import Card from "../components/ui/Card";
import AddAppointmentModal from "./modal/Appointments/AddAppointmentModal";
import EditAppointmentModal from "./modal/Appointments/EditAppointmentModal";
import DeleteAppointmentModal from "./modal/Appointments/DeleteAppointmentModal";
import {
  getAppointments,
  deleteAppointment,
} from "../services/appointmentService";
import "./css/Appointments/Appointments.css";

// ─── MAIN ──────────────────────────────────────────────────── Display
function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [doctorFilter, setDoctorFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [summary, setSummary] = useState({
    total: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
  });

  const totalAppointments = summary.total;
  const scheduledAppointments = summary.scheduled;
  const completedAppointments = summary.completed;
  const cancelledAppointments = summary.cancelled;

  const uniqueDoctors = [
    "All",
    ...new Set(appointments.map((appt) => appt.DocName)),
  ];

  // ─── FETCH ──────────────────────────────────────────────── Data
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await getAppointments();
        setAppointments(data.appointments);
        setSummary(data.summary);
      } catch (error) {
        console.log(error);
      }
    };

    loadAppointments();
  }, []);

  // ─── REFRESH ────────────────────────────────────────────── Reload
  const refreshAppointments = async () => {
    try {
      const data = await getAppointments();
      setAppointments(data.appointments);
      setSummary(data.summary);
    } catch (error) {
      console.log(error);
    }
  };

  // ─── HANDLERS ────────────────────────────────────────────── Actions
  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      await deleteAppointment(selectedAppointment.ApptID);
      alert("Appointment deleted successfully");
      refreshAppointments();
      setShowDeleteModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.log(error);
      alert("Failed to delete appointment");
    }
  };

  // ─── FILTERS ────────────────────────────────────────────── Logic
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.PatientName.toLowerCase().includes(search.toLowerCase()) ||
      appointment.ApptID.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || appointment.ApptStatus === statusFilter;
    const matchesDoctor =
      doctorFilter === "All" || appointment.DocName === doctorFilter;
    const matchesDate =
      !dateFilter ||
      new Date(appointment.ApptDate).toISOString().split("T")[0] === dateFilter;

    return matchesSearch && matchesStatus && matchesDoctor && matchesDate;
  });
  // ─── RENDER ────────────────────────────────────────────── Display
  return (
    <div className="appointments-page">
      <div className="appointments-header">
        <div>
          <h1 className="appointments-title">Appointments</h1>
          <p className="appointments-subtitle">
            Manage appointment schedules and statuses
          </p>
        </div>

        <div className="appointments-toolbar">
          <button className="primary-btn" onClick={() => setShowAddModal(true)}>
            Add Appointment
          </button>

          <button
            className={`secondary-btn ${
              !selectedAppointment ? "disabled-btn" : ""
            }`}
            disabled={!selectedAppointment}
            onClick={() => setShowEditModal(true)}
          >
            Edit
          </button>

          <button
            className={`danger-btn ${
              !selectedAppointment ? "disabled-btn" : ""
            }`}
            disabled={!selectedAppointment}
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>

          <SearchInput
            placeholder="Search appointments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="appointments-search"
          />

          <select
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            className="status-filter"
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
          >
            {uniqueDoctors.map((doctor) => (
              <option key={doctor} value={doctor}>
                {doctor === "All" ? "All Doctors" : doctor}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="status-filter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="summary-cards">
        <Card title="Total Appointments" value={totalAppointments} />
        <Card
          title="Scheduled"
          value={scheduledAppointments}
          className="blue-card"
        />
        <Card
          title="Completed"
          value={completedAppointments}
          className="green-card"
        />
        <Card
          title="Cancelled"
          value={cancelledAppointments}
          className="red-card"
        />
      </div>

      <div className="appointments-table-container">
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Appointment Date</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr
                key={appointment.ApptID}
                onClick={() => setSelectedAppointment(appointment)}
                className={
                  selectedAppointment?.ApptID === appointment.ApptID
                    ? "selected-row"
                    : ""
                }
              >
                <td className="appointment-id">{appointment.ApptID}</td>
                <td>{appointment.PatientName}</td>
                <td>{appointment.DocName}</td>
                <td>{new Date(appointment.ApptDate).toLocaleString()}</td>
                <td>
                  <StatusBadge status={appointment.ApptStatus} />
                </td>
                <td>{new Date(appointment.CreatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddAppointmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        refreshAppointments={refreshAppointments}
      />

      <EditAppointmentModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        selectedAppointment={selectedAppointment}
        setSelectedAppointment={setSelectedAppointment}
        refreshAppointments={refreshAppointments}
      />

      <DeleteAppointmentModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        selectedAppointment={selectedAppointment}
        handleDeleteAppointment={handleDeleteAppointment}
      />
    </div>
  );
}

export default Appointments;
