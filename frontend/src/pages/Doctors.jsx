import { useEffect, useState } from "react";
import SearchInput from "../components/ui/SearchInput";
import StatusBadge from "../components/ui/StatusBadge";
import Card from "../components/ui/Card";
import AddDoctorModal from "./modal/Doctors/AddDoctorModal";
import EditDoctorModal from "./modal/Doctors/EditDoctorModal";
import DeleteDoctorModal from "./modal/Doctors/DeleteDoctorModal";
import { getDoctors } from "../services/doctorService";
import "./css/Doctors/Doctors.css";

// ─── MAIN ──────────────────────────────────────────────────── Display
function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ─── FETCH ──────────────────────────────────────────────── Data
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data.doctors);
      } catch (error) {
        console.log(error);
      }
    };

    loadDoctors();
  }, []);

  // ─── REFRESH ────────────────────────────────────────────── Reload
  const refreshDoctors = async () => {
    try {
      const data = await getDoctors();
      setDoctors(data.doctors);
    } catch (error) {
      console.log(error);
    }
  };

  // ─── FILTERS ────────────────────────────────────────────── Logic
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.DocName.toLowerCase().includes(search.toLowerCase()) ||
      doctor.DocID.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || doctor.AvailabilityStatus === statusFilter;
    const matchesDepartment =
      departmentFilter === "All" || doctor.DeptName === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // ─── STATS ──────────────────────────────────────────────── Count
  const totalDoctors = doctors.length;
  const availableDoctors = doctors.filter(
    (doctor) => doctor.AvailabilityStatus === "Available",
  ).length;
  const unavailableDoctors = doctors.filter(
    (doctor) => doctor.AvailabilityStatus === "Unavailable",
  ).length;
  const onLeaveDoctors = doctors.filter(
    (doctor) => doctor.AvailabilityStatus === "On Leave",
  ).length;

  // ─── RENDER ────────────────────────────────────────────── Display
  return (
    <div className="doctors-page">
      <div className="doctors-header">
        <div>
          <h1 className="doctors-title">Doctors</h1>
          <p className="doctors-subtitle">
            Manage doctor records and monitor availability
          </p>
        </div>

        <div className="doctors-toolbar">
          <button className="primary-btn" onClick={() => setShowAddModal(true)}>
            Add Doctor
          </button>

          <button
            className={`secondary-btn ${!selectedDoctor ? "disabled-btn" : ""}`}
            disabled={!selectedDoctor}
            onClick={() => setShowEditModal(true)}
          >
            Edit
          </button>

          <button
            className={`danger-btn ${!selectedDoctor ? "disabled-btn" : ""}`}
            disabled={!selectedDoctor}
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>

          <SearchInput
            placeholder="Search doctors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="doctors-search"
          />

          <select
            className="status-filter"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="All">All Departments</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Gastroenterology">Gastroenterology</option>
            <option value="Pulmonology">Pulmonology</option>
            <option value="Endocrinology">Endocrinology</option>
          </select>

          <select
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option>Available</option>
            <option>Unavailable</option>
            <option>On Leave</option>
          </select>
        </div>
      </div>

      <div className="summary-cards">
        <Card title="Total Doctors" value={totalDoctors} />
        <Card
          title="Available"
          value={availableDoctors}
          className="green-card"
        />
        <Card
          title="Unavailable"
          value={unavailableDoctors}
          className="red-card"
        />
        <Card title="On Leave" value={onLeaveDoctors} className="blue-card" />
      </div>

      <div className="doctors-table-container">
        <table className="doctors-table">
          <thead>
            <tr>
              <th>Doctor ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Contact</th>
              <th>Fee</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredDoctors.map((doctor) => (
              <tr
                key={doctor.DocID}
                onClick={() => setSelectedDoctor(doctor)}
                className={
                  selectedDoctor?.DocID === doctor.DocID ? "selected-row" : ""
                }
              >
                <td className="doctor-id">{doctor.DocID}</td>
                <td>{doctor.DocName}</td>
                <td>{doctor.DeptName}</td>
                <td>{doctor.DocContact_Num || "-"}</td>
                <td>₱{doctor.ConsultationFee ? doctor.ConsultationFee : 0}</td>
                <td>
                  <StatusBadge status={doctor.AvailabilityStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddDoctorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        refreshDoctors={refreshDoctors}
      />

      <EditDoctorModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        selectedDoctor={selectedDoctor}
        setSelectedDoctor={setSelectedDoctor}
        refreshDoctors={refreshDoctors}
      />

      <DeleteDoctorModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedDoctor(null);
        }}
        selectedDoctor={selectedDoctor}
        refreshDoctors={refreshDoctors}
      />
    </div>
  );
}

export default Doctors;
