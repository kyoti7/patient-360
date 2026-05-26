import Modal from "../../../components/ui/Modal";

import { updateBilling } from "../../../services/billingService";

import "../../css/Billing/EditBillingModal.css";

function EditBillingModal({
  isOpen,
  onClose,
  selectedBilling,
  setSelectedBilling,
  refreshBillings,
}) {
  if (!selectedBilling) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateBilling(selectedBilling.BillingID, {
        PaymentStatus: selectedBilling.PaymentStatus,
        BillingDate: selectedBilling.BillingDate,
      });

      alert("Billing updated successfully");

      refreshBillings();

      onClose();
    } catch (error) {
      console.log(error);

      alert("Failed to update billing");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Billing">
      <form onSubmit={handleSubmit} className="edit-billing-form">
        <div className="form-group">
          <label>Payment Status</label>

          <select
            value={selectedBilling.PaymentStatus || ""}
            onChange={(e) =>
              setSelectedBilling({
                ...selectedBilling,
                PaymentStatus: e.target.value,
              })
            }
          >
            <option value="Paid">Paid</option>

            <option value="Pending">Pending</option>

            <option value="Partially Paid">Partially Paid</option>
          </select>
        </div>

        <div className="form-group">
          <label>Billing Date</label>

          <input
            type="datetime-local"
            value={
              selectedBilling.BillingDate
                ? new Date(selectedBilling.BillingDate)
                    .toISOString()
                    .slice(0, 16)
                : ""
            }
            onChange={(e) =>
              setSelectedBilling({
                ...selectedBilling,
                BillingDate: e.target.value,
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

export default EditBillingModal;
