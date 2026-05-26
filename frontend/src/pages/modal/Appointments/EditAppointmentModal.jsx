import Modal from "../../../components/ui/Modal";

import { updateAppointment } from "../../../services/appointmentService";

import "../../css/Appointments/EditAppointmentModal.css";

function EditAppointmentModal({
  isOpen,
  onClose,
  selectedAppointment,
  setSelectedAppointment,
  refreshAppointments,
}) {
  if (!selectedAppointment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateAppointment(selectedAppointment.ApptID, {
        ApptDate: selectedAppointment.ApptDate,
        ApptStatus: selectedAppointment.ApptStatus,
      });

      alert("Appointment updated successfully");

      refreshAppointments();

      onClose();
    } catch (error) {
      console.log(error);

      alert("Failed to update appointment");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Appointment">
      <form onSubmit={handleSubmit} className="edit-appointment-form">
        <div className="form-group">
          <label>Appointment Date</label>

          <input
            type="datetime-local"
            value={
              selectedAppointment.ApptDate
                ? selectedAppointment.ApptDate.slice(0, 16)
                : ""
            }
            onChange={(e) =>
              setSelectedAppointment({
                ...selectedAppointment,
                ApptDate: e.target.value,
              })
            }
          />
        </div>

        <div className="form-group">
          <label>Appointment Status</label>

          <select
            value={selectedAppointment.ApptStatus || ""}
            onChange={(e) =>
              setSelectedAppointment({
                ...selectedAppointment,
                ApptStatus: e.target.value,
              })
            }
          >
            <option value="Scheduled">Scheduled</option>

            <option value="Completed">Completed</option>

            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>

          <button type="submit">Save Changes</button>
        </div>
      </form>
    </Modal>
  );
}

export default EditAppointmentModal;
