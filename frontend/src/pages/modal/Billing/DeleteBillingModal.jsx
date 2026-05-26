import { useState } from "react";

import Modal from "../../../components/ui/Modal";

import { deleteBilling } from "../../../services/billingService";

import "../../css/Billing/DeleteBillingModal.css";

function DeleteBillingModal({
  isOpen,
  onClose,
  selectedBilling,
  refreshBillings,
  clearSelectedBilling,
}) {
  const [loading, setLoading] = useState(false);

  if (!selectedBilling) return null;

  const handleDelete = async () => {
    if (loading) return;

    try {
      setLoading(true);

      await deleteBilling(selectedBilling.BillingID);

      if (refreshBillings) {
        await refreshBillings();
      }

      if (clearSelectedBilling) {
        clearSelectedBilling();
      }

      onClose();

      alert("Billing deleted successfully");
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.detail || "Failed to delete billing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Billing">
      <div className="delete-billing-content">
        <p>
          Are you sure you want to delete{" "}
          <strong>{selectedBilling.BillingID}</strong>?
        </p>

        <div className="delete-billing-actions">
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

export default DeleteBillingModal;
