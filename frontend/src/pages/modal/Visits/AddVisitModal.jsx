import { useState } from "react";

import Modal from "../../../components/ui/Modal";

import { createVisit } from "../../../services/visitService";

import "../../css/Visits/AddVisitModal.css";

function AddVisitModal({ isOpen, onClose, refreshVisits }) {
  const [formData, setFormData] = useState({
    VisitID: "",
    PatientID: "",
    DocID: "",
    ApptID: "",
    VisitDate: "",
    VisitType: "Consultation",
    VisitStatus: "Ongoing",
    RoomNum: "",
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
      await createVisit(formData);

      await refreshVisits();

      onClose();

      setFormData({
        VisitID: "",
        PatientID: "",
        DocID: "",
        ApptID: "",
        VisitDate: "",
        VisitType: "Consultation",
        VisitStatus: "Ongoing",
        RoomNum: "",
      });

      alert("Visit created successfully");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.detail || "Failed to create visit");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Visit">
      <form className="add-visit-form" onSubmit={handleSubmit}>
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
          <label>Doctor ID</label>

          <input
            type="text"
            name="DocID"
            value={formData.DocID}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Appointment ID</label>

          <input
            type="text"
            name="ApptID"
            value={formData.ApptID}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Visit Date</label>

          <input
            type="datetime-local"
            name="VisitDate"
            value={formData.VisitDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Visit Type</label>

          <select
            name="VisitType"
            value={formData.VisitType}
            onChange={handleChange}
          >
            <option>Consultation</option>

            <option>Routine Checkup</option>

            <option>Follow Up</option>

            <option>Emergency</option>
          </select>
        </div>

        <div className="form-group">
          <label>Visit Status</label>

          <select
            name="VisitStatus"
            value={formData.VisitStatus}
            onChange={handleChange}
          >
            <option>Ongoing</option>

            <option>Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label>Room Number</label>

          <input
            type="text"
            name="RoomNum"
            value={formData.RoomNum}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>

          <button type="submit">Add Visit</button>
        </div>
      </form>
    </Modal>
  );
}

export default AddVisitModal;
