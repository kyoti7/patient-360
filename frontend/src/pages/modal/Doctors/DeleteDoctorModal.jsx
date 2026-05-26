import { useState } from "react";

import Modal from "../../../components/ui/Modal";

import { deleteDoctor } from "../../../services/doctorService";

import "../../css/Doctors/DeleteDoctorModal.css";

function DeleteDoctorModal({
  isOpen,
  onClose,
  selectedDoctor,
  refreshDoctors,
}) {
  const [loading, setLoading] = useState(false);

  if (!selectedDoctor) return null;

  const handleDelete = async () => {
    if (loading) return;

    try {
      setLoading(true);

      await deleteDoctor(selectedDoctor.DocID);

      if (refreshDoctors) {
        await refreshDoctors();
      }

      onClose();

      alert("Doctor deleted successfully");
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.detail || "Failed to delete doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Doctor">
      <div className="delete-doctor-content">
        <p>
          Are you sure you want to delete{" "}
          <strong>{selectedDoctor.DocName}</strong>?
        </p>

        <div className="delete-doctor-actions">
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

export default DeleteDoctorModal;
