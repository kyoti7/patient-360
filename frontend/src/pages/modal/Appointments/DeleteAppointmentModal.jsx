import Modal from "../../../components/ui/Modal";

import "../../../pages/css/Appointments/DeleteAppointmentModal.css";

function DeleteAppointmentModal({
  isOpen,
  onClose,
  selectedAppointment,
  handleDeleteAppointment,
}) {
  if (!isOpen || !selectedAppointment) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Appointment">
      <div className="delete-appointment-content">
        <p>
          Are you sure you want to delete appointment{" "}
          <strong>{selectedAppointment.ApptID}</strong>?
        </p>

        <div className="delete-appointment-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>

          <button
            type="button"
            className="danger-btn"
            onClick={handleDeleteAppointment}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteAppointmentModal;
