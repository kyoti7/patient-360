import { useEffect, useState } from "react";
import { getPatients } from "../services/patientService";
import SearchInput from "../components/ui/SearchInput";
import Card from "../components/ui/Card";
import StatusBadge from "../components/ui/StatusBadge";
import PatientDetailsModal from "./modal/Patients/PatientDetailsModal";
import AddPatientModal from "./modal/Patients/AddPatientModal";
import EditPatientModal from "./modal/Patients/EditPatientModal";
import DeletePatientModal from "./modal/Patients/DeletePatientModal";
import "./css/patients/Patients.css";

// ─── MAIN ──────────────────────────────────────────────────── Display
function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewPatient, setViewPatient] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ─── FETCH ──────────────────────────────────────────────── Data
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data.patients);
      } catch (error) {
        console.log(error);
      }
    };

    loadPatients();
  }, []);

  // ─── REFRESH ────────────────────────────────────────────── Reload
  const refreshPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data.patients);
    } catch (error) {
      console.log(error);
    }
  };

  // ─── FILTERS ────────────────────────────────────────────── Logic
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.PatientName.toLowerCase().includes(
      search.toLowerCase(),
    );
    const matchesStatus =
      statusFilter === "All Status" || patient.PatientStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ─── STATS ──────────────────────────────────────────────── Count
  const totalPatients = patients.length;
  const admittedPatients = patients.filter(
    (patient) => patient.PatientStatus === "Admitted",
  ).length;
  const outpatientPatients = patients.filter(
    (patient) => patient.PatientStatus === "Outpatient",
  ).length;
  const dischargedPatients = patients.filter(
    (patient) => patient.PatientStatus === "Discharged",
  ).length;

  // ─── RENDER ────────────────────────────────────────────── Display
  return (
    <div className="patients-page">
      <div className="patients-header">
        <div>
          <h1 className="patients-title">Patients</h1>
          <p className="patients-subtitle">
            Manage patient records and monitor statuses
          </p>
        </div>

        <div className="patients-toolbar">
          <button className="primary-btn" onClick={() => setShowAddModal(true)}>
            Add Patient
          </button>

          <button
            className={`secondary-btn ${
              !selectedPatient ? "disabled-btn" : ""
            }`}
            disabled={!selectedPatient}
            onClick={() => setShowEditModal(true)}
          >
            Edit
          </button>

          <button
            className={`danger-btn ${!selectedPatient ? "disabled-btn" : ""}`}
            disabled={!selectedPatient}
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>

          <div className="patients-search">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patients..."
            />
          </div>

          <select
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Admitted</option>
            <option>Outpatient</option>
            <option>Discharged</option>
          </select>
        </div>
      </div>

      <div className="summary-cards">
        <Card title="Total Patients" value={totalPatients} />
        <Card
          title="Admitted"
          value={admittedPatients}
          className="green-card"
        />
        <Card
          title="Outpatient"
          value={outpatientPatients}
          className="blue-card"
        />
        <Card
          title="Discharged"
          value={dischargedPatients}
          className="red-card"
        />
      </div>

      <div className="patients-table-container">
        <table className="patients-table">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Sex</th>
              <th>Blood Type</th>
              <th>Status</th>
              <th>Room</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.map((patient) => (
              <tr
                key={patient.PatientID}
                className={
                  selectedPatient?.PatientID === patient.PatientID
                    ? "selected-row"
                    : ""
                }
                onClick={() => setSelectedPatient(patient)}
                onDoubleClick={() => setViewPatient(patient)}
              >
                <td className="patient-id">{patient.PatientID}</td>
                <td>{patient.PatientName}</td>
                <td>{patient.Sex}</td>
                <td>{patient.BloodType}</td>
                <td>
                  <StatusBadge status={patient.PatientStatus} />
                </td>
                <td>{patient.RoomNum || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PatientDetailsModal
        selectedPatient={viewPatient}
        onClose={() => setViewPatient(null)}
      />

      <AddPatientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        refreshPatients={refreshPatients}
      />

      <EditPatientModal
        isOpen={showEditModal}
        selectedPatient={selectedPatient}
        setSelectedPatient={setSelectedPatient}
        onClose={() => setShowEditModal(false)}
        refreshPatients={refreshPatients}
      />

      <DeletePatientModal
        isOpen={showDeleteModal}
        selectedPatient={selectedPatient}
        onClose={() => setShowDeleteModal(false)}
        refreshPatients={refreshPatients}
        clearSelectedPatient={() => setSelectedPatient(null)}
      />
    </div>
  );
}

export default Patients;
