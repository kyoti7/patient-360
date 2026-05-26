import { useState } from "react";

import Modal from "../../../components/ui/Modal";

import { createBilling } from "../../../services/billingService";

import "../../css/Billing/AddBillingModal.css";

function AddBillingModal({ isOpen, onClose, refreshBillings }) {
  const [formData, setFormData] = useState({
    VisitID: "",
    PatientID: "",
    TotalAmount: "",
    PaymentStatus: "Pending",
    BillingDate: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createBilling({
        ...formData,
        TotalAmount: Number(formData.TotalAmount),
      });

      await refreshBillings();

      onClose();

      setFormData({
        VisitID: "",
        PatientID: "",
        TotalAmount: "",
        PaymentStatus: "Pending",
        BillingDate: "",
      });

      alert("Billing created successfully");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.detail || "Failed to create billing");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Billing">
      <form className="add-billing-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Visit ID</label>

          <input
            type="text"
            name="VisitID"
            value={formData.VisitID}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Patient ID</label>

          <input
            type="text"
            name="PatientID"
            value={formData.PatientID}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Total Amount</label>

          <input
            type="number"
            name="TotalAmount"
            value={formData.TotalAmount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Payment Status</label>

          <select
            name="PaymentStatus"
            value={formData.PaymentStatus}
            onChange={handleChange}
          >
            <option>Paid</option>

            <option>Pending</option>

            <option>Partially Paid</option>
          </select>
        </div>

        <div className="form-group">
          <label>Billing Date</label>

          <input
            type="datetime-local"
            name="BillingDate"
            value={formData.BillingDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>

          <button type="submit">Add Billing</button>
        </div>
      </form>
    </Modal>
  );
}

export default AddBillingModal;
