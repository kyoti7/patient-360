import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import { createPatient } from "../../../services/patientService";

import "../../css/Patients/AddPatientModal.css";

function AddPatientModal({ isOpen, onClose, refreshPatients }) {
  const [formData, setFormData] = useState({
    PatientName: "",
    BirthDate: "",
    Sex: "",
    BloodType: "",
    ContactNumber: "",
    PatientStatus: "",
    RoomNum: "",
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

      await createPatient(formData);

      alert("Patient added successfully");

      setFormData({
        PatientName: "",
        BirthDate: "",
        Sex: "",
        BloodType: "",
        ContactNumber: "",
        PatientStatus: "",
        RoomNum: "",
      });

      if (refreshPatients) {
        refreshPatients();
      }

      onClose();
    } catch (error) {
      console.log(error);

      alert("Failed to add patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Patient">
      <form onSubmit={handleSubmit} className="add-patient-form">
        <div className="form-group">
          <label>Patient Name</label>

          <input
            type="text"
            name="PatientName"
            value={formData.PatientName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Birth Date</label>

          <input
            type="date"
            name="BirthDate"
            value={formData.BirthDate}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Sex</label>

          <select name="Sex" value={formData.Sex} onChange={handleChange}>
            <option value="">Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="form-group">
          <label>Blood Type</label>

          <input
            type="text"
            name="BloodType"
            value={formData.BloodType}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Contact Number</label>

          <input
            type="text"
            name="ContactNumber"
            value={formData.ContactNumber}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Patient Status</label>

          <select
            name="PatientStatus"
            value={formData.PatientStatus}
            onChange={handleChange}
          >
            <option value="">Select Status</option>
            <option value="Admitted">Admitted</option>
            <option value="Discharged">Discharged</option>
            <option value="Outpatient">Outpatient</option>
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
          <button type="button" onClick={onClose} disabled={loading}>
            Cancel
          </button>

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Patient"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddPatientModal;
