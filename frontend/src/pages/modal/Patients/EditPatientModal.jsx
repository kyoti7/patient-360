import { updatePatient } from "../../../services/patientService";

import "../../css/Patients/EditPatientModal.css";

function EditPatientModal({
  isOpen,
  selectedPatient,
  setSelectedPatient,
  onClose,
  refreshPatients,
}) {
  if (!isOpen || !selectedPatient) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updatePatient(selectedPatient.PatientID, selectedPatient);

      alert("Patient updated successfully");

      await refreshPatients();

      onClose();
    } catch (error) {
      console.log(error);

      alert("Failed to update patient");
    }
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <h2>Edit Patient</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={selectedPatient.PatientName || ""}
            onChange={(e) =>
              setSelectedPatient({
                ...selectedPatient,
                PatientName: e.target.value,
              })
            }
            placeholder="Patient Name"
          />

          <input
            type="date"
            value={selectedPatient.BirthDate || ""}
            onChange={(e) =>
              setSelectedPatient({
                ...selectedPatient,
                BirthDate: e.target.value,
              })
            }
          />

          <select
            value={selectedPatient.Sex || ""}
            onChange={(e) =>
              setSelectedPatient({
                ...selectedPatient,
                Sex: e.target.value,
              })
            }
          >
            <option value="">Select Sex</option>

            <option value="Male">Male</option>

            <option value="Female">Female</option>
          </select>

          <input
            type="text"
            value={selectedPatient.BloodType || ""}
            onChange={(e) =>
              setSelectedPatient({
                ...selectedPatient,
                BloodType: e.target.value,
              })
            }
            placeholder="Blood Type"
          />

          <input
            type="text"
            value={selectedPatient.ContactNumber || ""}
            onChange={(e) =>
              setSelectedPatient({
                ...selectedPatient,
                ContactNumber: e.target.value,
              })
            }
            placeholder="Contact Number"
          />

          <select
            value={selectedPatient.PatientStatus || ""}
            onChange={(e) =>
              setSelectedPatient({
                ...selectedPatient,
                PatientStatus: e.target.value,
              })
            }
          >
            <option value="Admitted">Admitted</option>

            <option value="Outpatient">Outpatient</option>

            <option value="Discharged">Discharged</option>
          </select>

          <input
            type="text"
            value={selectedPatient.RoomNum || ""}
            onChange={(e) =>
              setSelectedPatient({
                ...selectedPatient,
                RoomNum: e.target.value,
              })
            }
            placeholder="Room Number"
          />

          <div className="edit-modal-actions">
            <button type="button" onClick={onClose} className="secondary-btn">
              Cancel
            </button>

            <button type="submit" className="primary-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPatientModal;
