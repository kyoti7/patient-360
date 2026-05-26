import { useState } from "react";

import Modal from "../../../components/ui/Modal";

import { createAppointment } from "../../../services/appointmentService";
import { getPatientById } from "../../../services/patientService";
import { getDoctorById } from "../../../services/doctorService";

import "../../css/Appointments/AddAppointmentModal.css";

function AddAppointmentModal({ isOpen, onClose, refreshAppointments }) {
  const [formData, setFormData] = useState({
    PatientID: "",
    DocID: "",
    ApptDate: "",
    ApptStatus: "",
  });

  const [patientInput, setPatientInput] = useState("");
  const [doctorInput, setDoctorInput] = useState("");

  const [patientPreview, setPatientPreview] = useState(null);
  const [doctorPreview, setDoctorPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePatientChange = async (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");

    setPatientInput(numericValue);

    if (!numericValue) {
      setPatientPreview(null);

      setFormData({
        ...formData,
        PatientID: "",
      });

      return;
    }

    const formattedPatientID = `P${numericValue.padStart(3, "0")}`;

    setFormData({
      ...formData,
      PatientID: formattedPatientID,
    });

    try {
      const patient = await getPatientById(formattedPatientID);

      setPatientPreview(patient);
    } catch (error) {
      console.log(error);

      setPatientPreview(null);
    }
  };

  const handleDoctorChange = async (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");

    setDoctorInput(numericValue);

    if (!numericValue) {
      setDoctorPreview(null);

      setFormData({
        ...formData,
        DocID: "",
      });

      return;
    }

    const formattedDoctorID = `DOC${numericValue.padStart(2, "0")}`;

    setFormData({
      ...formData,
      DocID: formattedDoctorID,
    });

    try {
      const doctor = await getDoctorById(formattedDoctorID);

      setDoctorPreview(doctor);
    } catch (error) {
      console.log(error);

      setDoctorPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createAppointment(formData);

      alert("Appointment created successfully");

      setFormData({
        PatientID: "",
        DocID: "",
        ApptDate: "",
        ApptStatus: "",
      });

      setPatientInput("");
      setDoctorInput("");

      setPatientPreview(null);
      setDoctorPreview(null);

      if (refreshAppointments) {
        refreshAppointments();
      }

      onClose();
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.detail || "Failed to create appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Appointment">
      <form onSubmit={handleSubmit} className="add-appointment-form">
        <div className="form-group">
          <label>Patient ID</label>

          <input
            type="text"
            placeholder="Enter patient number"
            value={patientInput}
            onChange={handlePatientChange}
            required
          />

          {patientPreview?.patient_info && (
            <div className="preview-box success-preview">
              {patientPreview?.patient_info?.PatientName}
            </div>
          )}

          {!patientPreview && patientInput && (
            <div className="preview-box error-preview">Patient not found</div>
          )}
        </div>

        <div className="form-group">
          <label>Doctor ID</label>

          <input
            type="text"
            placeholder="Enter doctor number"
            value={doctorInput}
            onChange={handleDoctorChange}
            required
          />

          {doctorPreview?.doctor_info && (
            <div className="preview-box success-preview">
              {doctorPreview.doctor_info.DocName}
            </div>
          )}

          {!doctorPreview && doctorInput && (
            <div className="preview-box error-preview">Doctor not found</div>
          )}
        </div>

        <div className="form-group">
          <label>Appointment Date</label>

          <input
            type="datetime-local"
            name="ApptDate"
            value={formData.ApptDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Status</label>

          <select
            name="ApptStatus"
            value={formData.ApptStatus}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>

            <option value="Scheduled">Scheduled</option>

            <option value="Completed">Completed</option>

            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose} disabled={loading}>
            Cancel
          </button>

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Appointment"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddAppointmentModal;
