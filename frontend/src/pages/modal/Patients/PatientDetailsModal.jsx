import { useEffect, useState } from "react";

import Modal from "../../../components/ui/Modal";

import { getPatientDetails } from "../../../services/patientService";
import MedicalRecordsModal from "./MedicalRecordsModal";

import "../../css/Patients/PatientDetailsModal.css";

function PatientDetailsModal({ selectedPatient, onClose }) {
  const [patientDetails, setPatientDetails] = useState(null);

  const [loading, setLoading] = useState(false);
  const [showMedicalRecords, setShowMedicalRecords] = useState(false);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (!selectedPatient) return;

      try {
        setLoading(true);

        const data = await getPatientDetails(selectedPatient.PatientID);

        setPatientDetails(data);

        console.log(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [selectedPatient]);

  const patientInfo = patientDetails?.patient_info;

  const clinicalNotes = patientDetails?.clinical_notes || [];

  const billingSummary = patientDetails?.billing_summary;

  const emergencyContacts = patientDetails?.emergency_contact || [];

  return (
    <Modal
      isOpen={selectedPatient !== null}
      onClose={onClose}
      title="Patient Details"
    >
      {loading && (
        <div className="loading-state">Loading patient details...</div>
      )}

      {selectedPatient && patientInfo && (
        <div className="patient-dashboard-modal">
          <div className="patient-dashboard-header">
            <div className="patient-profile-section">
              <div className="patient-avatar">
                {patientInfo.PatientName?.charAt(0)}
              </div>

              <div>
                <h2 className="patient-name">
                  {patientInfo.PatientID} - {patientInfo.PatientName}
                </h2>

                <p className="patient-meta">
                  {patientInfo.Sex} • {patientInfo.BirthDate || "No Birth Date"}
                </p>

                <p className="patient-meta">
                  {patientInfo.ContactNumber || "No Contact Number"}
                </p>

                <p className="patient-meta">{patientInfo.PatientStatus}</p>

                <p className="patient-meta">
                  Registered: {patientInfo.RegistrationDate || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="patient-dashboard-body">
            <div className="patient-sidebar">
              <div className="patient-info-card">
                <h3>Basic Information</h3>

                <p>
                  <strong>ID:</strong> {patientInfo.PatientID}
                </p>

                <p>
                  <strong>Name:</strong> {patientInfo.PatientName}
                </p>

                <p>
                  <strong>Sex:</strong> {patientInfo.Sex}
                </p>

                <p>
                  <strong>Birth Date:</strong> {patientInfo.BirthDate || "N/A"}
                </p>

                <p>
                  <strong>Blood Type:</strong> {patientInfo.BloodType}
                </p>

                <p>
                  <strong>Status:</strong> {patientInfo.PatientStatus}
                </p>

                <p>
                  <strong>Room:</strong> {patientInfo.RoomNum || "-"}
                </p>
              </div>

              <div className="patient-emergency-card">
                <h3>Emergency Contact</h3>

                {emergencyContacts.length > 0 ? (
                  emergencyContacts.map((contact, index) => (
                    <div key={index}>
                      <p>
                        <strong>{contact.ContactName}</strong>
                      </p>

                      <p>{contact.Relationship}</p>

                      <p>{contact.EContactNum}</p>
                    </div>
                  ))
                ) : (
                  <p>No emergency contact yet.</p>
                )}
              </div>
            </div>

            <div className="patient-main-content">
              <div className="patient-clinical-card">
                <div className="clinical-header">
                  <h3>Clinical Notes</h3>
                </div>

                <div className="clinical-note-box">
                  {clinicalNotes.length > 0 ? (
                    clinicalNotes.map((note, index) => (
                      <div key={index} className="clinical-note-item">
                        <p>
                          <strong>Checkup Type:</strong>{" "}
                          {note.CheckUp_Type || "N/A"}
                        </p>

                        <p>
                          <strong>Chief Complaint:</strong>{" "}
                          {note.ChiefComplaint || "N/A"}
                        </p>

                        <p>
                          <strong>Symptoms:</strong>{" "}
                          {Array.isArray(note.Symptoms)
                            ? note.Symptoms.join(", ")
                            : "N/A"}
                        </p>

                        <p>
                          <strong>Diagnosis:</strong> {note.Diagnosis || "N/A"}
                        </p>

                        <p>
                          <strong>Clinical Notes:</strong>{" "}
                          {note.ClinicalNotes || "N/A"}
                        </p>

                        <p>
                          <strong>Prescriptions:</strong>{" "}
                          {Array.isArray(note.Prescriptions)
                            ? note.Prescriptions.join(", ")
                            : note.Prescriptions || "N/A"}
                        </p>

                        <p>
                          <strong>Follow Up Required:</strong>{" "}
                          {note.FollowUp_Required ? "Yes" : "No"}
                        </p>

                        <hr />
                      </div>
                    ))
                  ) : (
                    <p>No clinical notes available.</p>
                  )}
                </div>

                <button
                  className="view-notes-btn"
                  onClick={() => setShowMedicalRecords(true)}
                >
                  View All Medical Records
                </button>
              </div>
            </div>

            <div className="patient-timeline">
              <div className="patient-billing-card">
                <h3>Billing Details</h3>

                <div className="billing-details-box">
                  <p>
                    <strong>Total Bills:</strong>{" "}
                    {billingSummary?.TotalBills || 0}
                  </p>

                  <p>
                    <strong>Total Amount:</strong> ₱
                    {billingSummary?.TotalAmount || 0}
                  </p>

                  <p>
                    <strong>Paid:</strong> ₱{billingSummary?.Paid || 0}
                  </p>

                  <p>
                    <strong>Pending:</strong> ₱{billingSummary?.Pending || 0}
                  </p>

                  <p>
                    <strong>Partially Paid:</strong> ₱
                    {billingSummary?.PartiallyPaid || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <MedicalRecordsModal
        isOpen={showMedicalRecords}
        onClose={() => setShowMedicalRecords(false)}
        selectedPatient={selectedPatient}
      />
    </Modal>
  );
}

export default PatientDetailsModal;
