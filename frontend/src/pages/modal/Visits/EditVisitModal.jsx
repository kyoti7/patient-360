import Modal from "../../../components/ui/Modal";

import { updateVisit } from "../../../services/visitService";

import "../../css/Visits/EditVisitModal.css";

function EditVisitModal({
  isOpen,
  onClose,
  selectedVisit,
  setSelectedVisit,
  refreshVisits,
}) {
  if (!selectedVisit) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateVisit(selectedVisit.VisitID, {
        VisitDate: selectedVisit.VisitDate,
        VisitType: selectedVisit.VisitType,
        VisitStatus: selectedVisit.VisitStatus,
        RoomNum: selectedVisit.RoomNum,
      });

      alert("Visit updated successfully");

      refreshVisits();

      onClose();
    } catch (error) {
      console.log(error);

      alert("Failed to update visit");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Visit">
      <form onSubmit={handleSubmit} className="edit-visit-form">
        <div className="form-group">
          <label>Visit Date</label>

          <input
            type="datetime-local"
            value={
              selectedVisit.VisitDate
                ? new Date(selectedVisit.VisitDate).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) =>
              setSelectedVisit({
                ...selectedVisit,
                VisitDate: e.target.value,
              })
            }
          />
        </div>

        <div className="form-group">
          <label>Visit Type</label>

          <select
            value={selectedVisit.VisitType || ""}
            onChange={(e) =>
              setSelectedVisit({
                ...selectedVisit,
                VisitType: e.target.value,
              })
            }
          >
            <option value="Consultation">Consultation</option>

            <option value="Routine Checkup">Routine Checkup</option>

            <option value="Follow Up">Follow Up</option>

            <option value="Emergency">Emergency</option>
          </select>
        </div>

        <div className="form-group">
          <label>Visit Status</label>

          <select
            value={selectedVisit.VisitStatus || ""}
            onChange={(e) =>
              setSelectedVisit({
                ...selectedVisit,
                VisitStatus: e.target.value,
              })
            }
          >
            <option value="Ongoing">Ongoing</option>

            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label>Room Number</label>

          <input
            type="text"
            value={selectedVisit.RoomNum || ""}
            onChange={(e) =>
              setSelectedVisit({
                ...selectedVisit,
                RoomNum: e.target.value,
              })
            }
          />
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

export default EditVisitModal;
