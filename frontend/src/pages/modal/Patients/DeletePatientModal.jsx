import Modal from "../../../components/ui/Modal";

import { deletePatient } from "../../../services/patientService";

import "../../css/Patients/DeletePatientModal.css";

function DeletePatientModal({
  isOpen,
  selectedPatient,
  onClose,
  refreshPatients,
  clearSelectedPatient,
}) {
  if (!selectedPatient) return null;

  const handleDeletePatient = async () => {
    try {
      await deletePatient(selectedPatient.PatientID);

      alert("Patient deleted successfully");

      await refreshPatients();

      clearSelectedPatient();

      onClose();
    } catch (error) {
      console.log(error);

      alert("Failed to delete patient");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Patient">
      <div className="delete-patient-content">
        <p>
          Are you sure you want to delete{" "}
          <strong>{selectedPatient.PatientName}</strong>?
        </p>

        <div className="delete-patient-actions">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Cancel
          </button>

          <button
            type="button"
            className="danger-btn"
            onClick={handleDeletePatient}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DeletePatientModal;
