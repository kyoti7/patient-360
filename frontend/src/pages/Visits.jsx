import { useEffect, useState } from "react";
import { getVisits } from "../services/visitService";

import StatusBadge from "../components/ui/StatusBadge";
import Card from "../components/ui/Card";
import SearchInput from "../components/ui/SearchInput";

import AddVisitModal from "./modal/Visits/AddVisitModal";
import EditVisitModal from "./modal/Visits/EditVisitModal";
import DeleteVisitModal from "./modal/Visits/DeleteVisitModal";

import "./css/Visits/Visits.css";

function Visits() {
  const [visits, setVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");
  const [doctorFilter, setDoctorFilter] = useState("All Doctors");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [dateFilter, setDateFilter] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const loadVisits = async () => {
      try {
        const data = await getVisits();

        setVisits(data.visits);
      } catch (error) {
        console.log(error);
      }
    };

    loadVisits();
  }, []);
  const refreshVisits = async () => {
    try {
      const data = await getVisits();

      setVisits(data.visits);
    } catch (error) {
      console.log(error);
    }
  };
  const uniqueDoctors = [
    "All Doctors",
    ...new Set(visits.map((visit) => visit.DocName)),
  ];
  const uniqueTypes = [
    "All Types",
    ...new Set(visits.map((visit) => visit.VisitType)),
  ];

  const filteredVisits = visits.filter((visit) => {
    const matchesSearch =
      visit.PatientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.VisitID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.DocName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || visit.VisitStatus === statusFilter;

    const matchesDoctor =
      doctorFilter === "All Doctors" || visit.DocName === doctorFilter;

    const matchesType =
      typeFilter === "All Types" || visit.VisitType === typeFilter;

    const matchesDate =
      !dateFilter ||
      new Date(visit.VisitDate).toISOString().split("T")[0] === dateFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesDoctor &&
      matchesType &&
      matchesDate
    );
  });

  return (
    <div className="visits-page">
      <div className="visits-header">
        <div>
          <h1 className="visits-title">Visits</h1>

          <p className="visits-subtitle">
            Manage patient visits and monitoring
          </p>
        </div>

        <div className="visits-toolbar">
          <button className="primary-btn" onClick={() => setShowAddModal(true)}>
            Add Visit
          </button>

          <button
            className={`secondary-btn ${!selectedVisit ? "disabled-btn" : ""}`}
            disabled={!selectedVisit}
            onClick={() => setShowEditModal(true)}
          >
            Edit
          </button>

          <button
            className={`danger-btn ${!selectedVisit ? "disabled-btn" : ""}`}
            disabled={!selectedVisit}
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>

          <SearchInput
            placeholder="Search visits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="visits-search"
          />

          <select
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>

            <option value="Ongoing">Ongoing</option>

            <option value="Completed">Completed</option>
          </select>

          <select
            className="status-filter"
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
          >
            {uniqueDoctors.map((doctor) => (
              <option key={doctor} value={doctor}>
                {doctor}
              </option>
            ))}
          </select>

          <select
            className="status-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
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
        <Card title="Total Visits" value={visits.length} />

        <Card
          title="Ongoing"
          value={
            visits.filter((visit) => visit.VisitStatus === "Ongoing").length
          }
          className="ongoing-card"
        />

        <Card
          title="Completed"
          value={
            visits.filter((visit) => visit.VisitStatus === "Completed").length
          }
          className="completed-card"
        />

        <Card
          title="Emergency"
          value={
            visits.filter((visit) => visit.VisitType === "Emergency").length
          }
          className="emergency-card"
        />
      </div>

      <div className="visits-table-container">
        <table className="visits-table">
          <thead>
            <tr>
              <th>Visit ID</th>

              <th>Patient</th>

              <th>Doctor</th>

              <th>Visit Date</th>

              <th>Visit Type</th>

              <th>Status</th>

              <th>Room</th>
            </tr>
          </thead>

          <tbody>
            {filteredVisits.map((visit) => (
              <tr
                key={visit.VisitID}
                onClick={() => setSelectedVisit(visit)}
                className={
                  selectedVisit?.VisitID === visit.VisitID ? "selected-row" : ""
                }
              >
                <td className="visit-id">{visit.VisitID}</td>

                <td>{visit.PatientName}</td>

                <td>{visit.DocName}</td>

                <td>{new Date(visit.VisitDate).toLocaleDateString()}</td>

                <td>{visit.VisitType}</td>

                <td>
                  <StatusBadge status={visit.VisitStatus} />
                </td>

                <td>{visit.RoomNum}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddVisitModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        refreshVisits={refreshVisits}
      />

      <EditVisitModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        selectedVisit={selectedVisit}
        setSelectedVisit={setSelectedVisit}
        refreshVisits={refreshVisits}
      />

      <DeleteVisitModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);

          setSelectedVisit(null);
        }}
        selectedVisit={selectedVisit}
        refreshVisits={refreshVisits}
      />
    </div>
  );
}

export default Visits;
