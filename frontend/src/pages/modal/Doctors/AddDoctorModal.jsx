import { useState } from "react";

import Modal from "../../../components/ui/Modal";
import { createDoctor } from "../../../services/doctorService";

import "../../css/Doctors/AddDoctorModal.css";

const departments = [
  { id: "DEP001", name: "General Medicine" },
  { id: "DEP002", name: "Cardiology" },
  { id: "DEP003", name: "Pulmonology" },
  { id: "DEP004", name: "Endocrinology" },
  { id: "DEP005", name: "Gastroenterology" },
  { id: "DEP006", name: "Pediatrics" },
  { id: "DEP007", name: "Orthopedics" },
  { id: "DEP008", name: "Neurology" },
  { id: "DEP009", name: "Dermatology" },
  { id: "DEP010", name: "Emergency Medicine" },
];

function AddDoctorModal({ isOpen, onClose, refreshDoctors }) {
  const [formData, setFormData] = useState({
    DocName: "",
    DeptID: "",
    DocContact_Num: "",
    ConsultationFee: "",
    AvailabilityStatus: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createDoctor(formData);

      alert("Doctor added successfully");

      setFormData({
        DocName: "",
        DeptID: "",
        DocContact_Num: "",
        ConsultationFee: "",
        AvailabilityStatus: "",
      });

      if (refreshDoctors) {
        refreshDoctors();
      }

      onClose();
    } catch (error) {
      console.log(error);

      alert("Failed to add doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Doctor">
      <form onSubmit={handleSubmit} className="add-doctor-form">
        <div className="form-group">
          <label>Doctor Name</label>

          <input
            type="text"
            name="DocName"
            value={formData.DocName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Department</label>

          <select
            name="DeptID"
            value={formData.DeptID}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>

            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Contact Number</label>

          <input
            type="text"
            name="DocContact_Num"
            value={formData.DocContact_Num}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Consultation Fee</label>

          <input
            type="number"
            name="ConsultationFee"
            value={formData.ConsultationFee}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Availability Status</label>

          <select
            name="AvailabilityStatus"
            value={formData.AvailabilityStatus}
            onChange={handleChange}
          >
            <option value="">Select Status</option>

            <option value="Available">Available</option>

            <option value="Unavailable">Unavailable</option>

            <option value="On Leave">On Leave</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose} disabled={loading}>
            Cancel
          </button>

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Doctor"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddDoctorModal;
