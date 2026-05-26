import { useState } from "react";

import Modal from "../../../components/ui/Modal";

import { deleteVisit } from "../../../services/visitService";

import "../../css/Visits/DeleteVisitModal.css";

function DeleteVisitModal({
  isOpen,
  onClose,
  selectedVisit,
  refreshVisits,
  clearSelectedVisit,
}) {
  const [loading, setLoading] = useState(false);

  if (!selectedVisit) return null;

  const handleDelete = async () => {
    if (loading) return;

    try {
      setLoading(true);

      await deleteVisit(selectedVisit.VisitID);

      if (refreshVisits) {
        await refreshVisits();
      }

      if (clearSelectedVisit) {
        clearSelectedVisit();
      }

      onClose();

      alert("Visit deleted successfully");
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.detail || "Failed to delete visit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Visit">
      <div className="delete-visit-content">
        <p>
          Are you sure you want to delete{" "}
          <strong>{selectedVisit.VisitID}</strong>?
        </p>

        <div className="delete-visit-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="danger-btn"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteVisitModal;
