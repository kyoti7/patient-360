import Modal from "../../../components/ui/Modal";

import { updateDoctor } from "../../../services/doctorService";

import "../../css/Doctors/EditDoctorModal.css";

function EditDoctorModal({
  isOpen,
  onClose,
  selectedDoctor,
  setSelectedDoctor,
  refreshDoctors,
}) {
  if (!selectedDoctor) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateDoctor(selectedDoctor.DocID, {
        DocName: selectedDoctor.DocName,
        DocContact_Num: selectedDoctor.DocContact_Num,
        ConsultationFee: selectedDoctor.ConsultationFee,
        AvailabilityStatus: selectedDoctor.AvailabilityStatus,
      });

      alert("Doctor updated successfully");

      refreshDoctors();

      onClose();
    } catch (error) {
      console.log(error);

      alert("Failed to update doctor");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Doctor">
      <form onSubmit={handleSubmit} className="edit-doctor-form">
        <div className="form-group">
          <label>Doctor Name</label>

          <input
            type="text"
            value={selectedDoctor.DocName || ""}
            onChange={(e) =>
              setSelectedDoctor({
                ...selectedDoctor,
                DocName: e.target.value,
              })
            }
          />
        </div>

        <div className="form-group">
          <label>Contact Number</label>

          <input
            type="text"
            value={selectedDoctor.DocContact_Num || ""}
            onChange={(e) =>
              setSelectedDoctor({
                ...selectedDoctor,
                DocContact_Num: e.target.value,
              })
            }
          />
        </div>

        <div className="form-group">
          <label>Consultation Fee</label>

          <input
            type="number"
            value={selectedDoctor.ConsultationFee || ""}
            onChange={(e) =>
              setSelectedDoctor({
                ...selectedDoctor,
                ConsultationFee: e.target.value,
              })
            }
          />
        </div>

        <div className="form-group">
          <label>Availability Status</label>

          <select
            value={selectedDoctor.AvailabilityStatus || ""}
            onChange={(e) =>
              setSelectedDoctor({
                ...selectedDoctor,
                AvailabilityStatus: e.target.value,
              })
            }
          >
            <option value="Available">Available</option>

            <option value="Unavailable">Unavailable</option>

            <option value="On Leave">On Leave</option>
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

export default EditDoctorModal;
