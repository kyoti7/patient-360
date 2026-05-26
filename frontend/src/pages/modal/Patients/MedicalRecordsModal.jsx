import { useEffect, useState, useRef } from "react";
import Modal from "../../../components/ui/Modal";

import {
  getClinicalNotes,
  getDiagnosticRecords,
  getTreatmentPlans,
  createClinicalNote,
  createDiagnosticRecord,
  createTreatmentPlan,
  updateClinicalNote,
  updateDiagnosticRecord,
  updateTreatmentPlan,
  deleteClinicalNote,
  deleteDiagnosticRecord,
  deleteTreatmentPlan,
} from "../../../services/medicalRecordService";

import "../../css/Patients/MedicalRecordsModal.css";

// Helper utilities for safe record handling
const safeHelpers = {
  isPlaceholderRecord: (record) => {
    if (!record) return true;
    return !record.PatientID && !record.VisitID;
  },

  isTemporaryRecord: (record) => {
    if (!record) return false;
    return record.isNew === true;
  },

  isPersistedRecord: (record) => {
    if (!record) return false;
    return record.PatientID && record.VisitID && record.isNew !== true;
  },

  validateRecord: (record, type) => {
    if (!record) return { valid: false, message: "No record selected" };
    if (safeHelpers.isPlaceholderRecord(record)) {
      return { valid: false, message: "No record selected" };
    }
    if (!record.PatientID) return { valid: false, message: "No record selected" };
    if (!record.VisitID) return { valid: false, message: "No record selected" };
    return { valid: true, message: "" };
  },

  getRecordValue: (record, field, defaultValue = "") => {
    return record && record[field] !== undefined && record[field] !== null
      ? record[field]
      : defaultValue;
  },
};

function MedicalRecordsModal({ isOpen, onClose, selectedPatient }) {
  const [loading, setLoading] = useState(false);

  const [clinicalNotes, setClinicalNotes] = useState([]);
  const [diagnosticRecords, setDiagnosticRecords] = useState([]);
  const [treatmentPlans, setTreatmentPlans] = useState([]);

  const [isEditing, setIsEditing] = useState(false);

  const [selectedType, setSelectedType] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");

  const autosaveTimeoutsRef = useRef({});
  const autosavePendingRef = useRef({});

  useEffect(() => {
    const loadMedicalRecords = async () => {
      if (!selectedPatient?.PatientID) return;

      try {
        setLoading(true);
        setErrorMessage("");

        const [clinicalData, diagnosticData, treatmentData] = await Promise.all([
          getClinicalNotes(selectedPatient.PatientID).catch(() => ({
            clinical_notes: [],
          })),
          getDiagnosticRecords(selectedPatient.PatientID).catch(() => ({
            diagnostic_records: [],
          })),
          getTreatmentPlans(selectedPatient.PatientID).catch(() => ({
            treatment_plans: [],
          })),
        ]);

        setClinicalNotes((clinicalData.clinical_notes || []).map(note => ({ ...note, isNew: false })));
        setDiagnosticRecords((diagnosticData.diagnostic_records || []).map(record => ({ ...record, isNew: false })));
        setTreatmentPlans((treatmentData.treatment_plans || []).map(plan => ({ ...plan, isNew: false })));
      } catch (error) {
        console.error("Medical record error:", error.response?.data || error);
        setErrorMessage("Failed to load medical records");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadMedicalRecords();
    }
  }, [isOpen, selectedPatient]);

  const generateDocID = () => {
    return `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const parseArrayField = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  const formatArrayField = (arr) => {
    if (!arr || arr.length === 0) return "";
    if (Array.isArray(arr)) return arr.join(", ");
    return arr;
  };

  const autosaveRecord = async (type, index, record) => {
    if (!record) return;
    if (safeHelpers.isPlaceholderRecord(record)) return;

    const validation = safeHelpers.validateRecord(record, type);
    if (!validation.valid) {
      console.log(`Autosave skipped for ${type}[${index}]: ${validation.message}`);
      return;
    }

    const key = `${type}-${index}`;

    if (autosaveTimeoutsRef.current[key]) {
      clearTimeout(autosaveTimeoutsRef.current[key]);
    }

    if (autosavePendingRef.current[key]) {
      console.log(`Autosave already pending for ${key}`);
      return;
    }

    autosaveTimeoutsRef.current[key] = setTimeout(async () => {
      try {
        autosavePendingRef.current[key] = true;

        if (type === "clinical") {
          if (record.isNew) {
            const payload = {
              ...record,
              DocID: record.DocID || generateDocID(),
              VisitDate: record.VisitDate || new Date().toISOString(),
              Symptoms: parseArrayField(record.Symptoms),
              Prescriptions: parseArrayField(record.Prescriptions),
            };

            await createClinicalNote(payload);

            setClinicalNotes((prev) => {
              const updated = [...prev];
              if (updated[index]) {
                updated[index] = { ...updated[index], isNew: false };
              }
              return updated;
            });
          } else {
            const payload = {
              ...record,
              Symptoms: parseArrayField(record.Symptoms),
              Prescriptions: parseArrayField(record.Prescriptions),
            };
            await updateClinicalNote(
              record.PatientID,
              record.VisitID,
              payload
            );
          }
        } else if (type === "diagnostic") {
          if (record.isNew) {
            const payload = {
              ...record,
              DocID: record.DocID || generateDocID(),
            };
            await createDiagnosticRecord(payload);

            setDiagnosticRecords((prev) => {
              const updated = [...prev];
              if (updated[index]) {
                updated[index] = { ...updated[index], isNew: false };
              }
              return updated;
            });
          } else {
            await updateDiagnosticRecord(
              record.PatientID,
              record.VisitID,
              record
            );
          }
        } else if (type === "treatment") {
          if (record.isNew) {
            const payload = {
              ...record,
              DocID: record.DocID || generateDocID(),
              RecommendedActions: parseArrayField(record.RecommendedActions),
              FollowUp_Date:
                record.FollowUp_Date && record.FollowUp_Date.trim()
                  ? record.FollowUp_Date
                  : null,
            };
            await createTreatmentPlan(payload);

            setTreatmentPlans((prev) => {
              const updated = [...prev];
              if (updated[index]) {
                updated[index] = { ...updated[index], isNew: false };
              }
              return updated;
            });
          } else {
            const payload = {
              ...record,
              RecommendedActions: parseArrayField(record.RecommendedActions),
              FollowUp_Date:
                record.FollowUp_Date && record.FollowUp_Date.trim()
                  ? record.FollowUp_Date
                  : null,
            };
            await updateTreatmentPlan(
              record.PatientID,
              record.VisitID,
              payload
            );
          }
        }
      } catch (error) {
        console.error("Medical record error:", error.response?.data || error);
        setErrorMessage(
          `Failed to save record: ${error.response?.data?.detail || error.message}`
        );
      } finally {
        delete autosavePendingRef.current[key];
      }
    }, 1000);
  };

  const handleDelete = async () => {
    console.log("Delete initiated");
    console.log("Selected Type:", selectedType);
    console.log("Selected Index:", selectedIndex);

    if (selectedType === null || selectedIndex === null) {
      setErrorMessage("No record selected");
      console.log("Delete blocked: No record selected");
      return;
    }

    try {
      setErrorMessage("");

      let record = null;

      if (selectedType === "clinical") {
        record = clinicalNotes[selectedIndex];
      } else if (selectedType === "diagnostic") {
        record = diagnosticRecords[selectedIndex];
      } else if (selectedType === "treatment") {
        record = treatmentPlans[selectedIndex];
      }

      console.log("Current Record:", record);

      if (!record) {
        setErrorMessage("No record selected");
        console.log("Delete blocked: Invalid index");
        return;
      }

      if (safeHelpers.isPlaceholderRecord(record)) {
        setErrorMessage("No record selected");
        console.log("Delete blocked: Placeholder record");
        return;
      }

      if (safeHelpers.isTemporaryRecord(record)) {
        console.log("Deleting temporary record at index", selectedIndex);
        setClinicalNotes((prev) => {
          if (selectedType === "clinical") {
            const updated = [...prev];
            updated.splice(selectedIndex, 1);
            return updated;
          }
          return prev;
        });

        setDiagnosticRecords((prev) => {
          if (selectedType === "diagnostic") {
            const updated = [...prev];
            updated.splice(selectedIndex, 1);
            return updated;
          }
          return prev;
        });

        setTreatmentPlans((prev) => {
          if (selectedType === "treatment") {
            const updated = [...prev];
            updated.splice(selectedIndex, 1);
            return updated;
          }
          return prev;
        });

        setSelectedType(null);
        setSelectedIndex(null);
        setIsEditing(false);
        setErrorMessage("Temporary record removed");
        console.log("Temporary record deleted successfully");
        return;
      }

      if (safeHelpers.isPersistedRecord(record)) {
        console.log("Deleting persisted record with PatientID:", record.PatientID, "VisitID:", record.VisitID);
        if (selectedType === "clinical") {
          await deleteClinicalNote(record.PatientID, record.VisitID);
        } else if (selectedType === "diagnostic") {
          await deleteDiagnosticRecord(record.PatientID, record.VisitID);
        } else if (selectedType === "treatment") {
          await deleteTreatmentPlan(record.PatientID, record.VisitID);
        }

        // Only remove from state after successful deletion
        setClinicalNotes((prev) => {
          if (selectedType === "clinical") {
            const updated = [...prev];
            updated.splice(selectedIndex, 1);
            return updated;
          }
          return prev;
        });

        setDiagnosticRecords((prev) => {
          if (selectedType === "diagnostic") {
            const updated = [...prev];
            updated.splice(selectedIndex, 1);
            return updated;
          }
          return prev;
        });

        setTreatmentPlans((prev) => {
          if (selectedType === "treatment") {
            const updated = [...prev];
            updated.splice(selectedIndex, 1);
            return updated;
          }
          return prev;
        });

        setSelectedType(null);
        setSelectedIndex(null);
        setIsEditing(false);
        setErrorMessage("");
        console.log("Record deleted successfully");
      }
    } catch (error) {
      console.error("Medical record error:", error.response?.data || error);
      console.error("Delete failed - record will remain in database");
      setErrorMessage(
        `Failed to delete record: ${error.response?.data?.detail || error.message}`
      );
    }
  };

  const isRecordEmpty = (record, type) => {
    if (!record) return true;

    if (type === "clinical") {
      return (
        !safeHelpers.getRecordValue(record, "Diagnosis", "").trim() &&
        !safeHelpers.getRecordValue(record, "Symptoms", "").trim() &&
        !safeHelpers.getRecordValue(record, "ClinicalNotes", "").trim()
      );
    }
    if (type === "diagnostic") {
      return (
        !safeHelpers.getRecordValue(record, "TestType", "").trim() &&
        !safeHelpers.getRecordValue(record, "Findings", "").trim() &&
        !safeHelpers.getRecordValue(record, "ScanResult", "").trim()
      );
    }
    if (type === "treatment") {
      return (
        !safeHelpers.getRecordValue(record, "RecommendedActions", "").trim() &&
        !safeHelpers.getRecordValue(record, "FollowUp_Date", "").trim()
      );
    }
    return false;
  };

  const handleSave = async () => {
    try {
      setErrorMessage("");

      if (selectedType === "clinical" && selectedIndex !== null) {
        const note = clinicalNotes[selectedIndex];

        if (!note) {
          setErrorMessage("No record selected");
          return;
        }

        if (safeHelpers.isPlaceholderRecord(note)) {
          setErrorMessage("No record selected");
          return;
        }

        const validation = safeHelpers.validateRecord(note, "clinical");
        if (!validation.valid) {
          setErrorMessage(validation.message);
          return;
        }

        if (isRecordEmpty(note, "clinical")) {
          setErrorMessage(
            "Cannot save: Diagnosis, Symptoms, or Clinical Notes must have content"
          );
          return;
        }

        if (note.isNew) {
          const payload = {
            ...note,
            DocID: note.DocID || generateDocID(),
            VisitDate: note.VisitDate || new Date().toISOString(),
            Symptoms: parseArrayField(note.Symptoms),
            Prescriptions: parseArrayField(note.Prescriptions),
          };

          await createClinicalNote(payload);

          setClinicalNotes((prev) => {
            const updated = [...prev];
            if (updated[selectedIndex]) {
              updated[selectedIndex] = { ...updated[selectedIndex], isNew: false };
            }
            return updated;
          });

          setSelectedType(null);
          setSelectedIndex(null);
          setIsEditing(false);
        } else {
          const payload = {
            ...note,
            Symptoms: parseArrayField(note.Symptoms),
            Prescriptions: parseArrayField(note.Prescriptions),
          };

          await updateClinicalNote(note.PatientID, note.VisitID, payload);
          setIsEditing(false);
        }
      }

      if (selectedType === "diagnostic" && selectedIndex !== null) {
        const record = diagnosticRecords[selectedIndex];

        if (!record) {
          setErrorMessage("No record selected");
          return;
        }

        if (safeHelpers.isPlaceholderRecord(record)) {
          setErrorMessage("No record selected");
          return;
        }

        const validation = safeHelpers.validateRecord(record, "diagnostic");
        if (!validation.valid) {
          setErrorMessage(validation.message);
          return;
        }

        if (isRecordEmpty(record, "diagnostic")) {
          setErrorMessage(
            "Cannot save: Test Type, Findings, or Scan Result must have content"
          );
          return;
        }

        if (record.isNew) {
          const payload = {
            ...record,
            DocID: record.DocID || generateDocID(),
          };

          await createDiagnosticRecord(payload);

          setDiagnosticRecords((prev) => {
            const updated = [...prev];
            if (updated[selectedIndex]) {
              updated[selectedIndex] = { ...updated[selectedIndex], isNew: false };
            }
            return updated;
          });

          setSelectedType(null);
          setSelectedIndex(null);
          setIsEditing(false);
        } else {
          await updateDiagnosticRecord(record.PatientID, record.VisitID, record);
          setIsEditing(false);
        }
      }

      if (selectedType === "treatment" && selectedIndex !== null) {
        const plan = treatmentPlans[selectedIndex];

        if (!plan) {
          setErrorMessage("No record selected");
          return;
        }

        if (safeHelpers.isPlaceholderRecord(plan)) {
          setErrorMessage("No record selected");
          return;
        }

        const validation = safeHelpers.validateRecord(plan, "treatment");
        if (!validation.valid) {
          setErrorMessage(validation.message);
          return;
        }

        if (isRecordEmpty(plan, "treatment")) {
          setErrorMessage(
            "Cannot save: Recommended Actions or Follow-up Date must have content"
          );
          return;
        }

        if (plan.isNew) {
          const payload = {
            ...plan,
            DocID: plan.DocID || generateDocID(),
            RecommendedActions: parseArrayField(plan.RecommendedActions),
            FollowUp_Date:
              plan.FollowUp_Date && plan.FollowUp_Date.trim()
                ? plan.FollowUp_Date
                : null,
          };

          await createTreatmentPlan(payload);

          setTreatmentPlans((prev) => {
            const updated = [...prev];
            if (updated[selectedIndex]) {
              updated[selectedIndex] = { ...updated[selectedIndex], isNew: false };
            }
            return updated;
          });

          setSelectedType(null);
          setSelectedIndex(null);
          setIsEditing(false);
        } else {
          const payload = {
            ...plan,
            RecommendedActions: parseArrayField(plan.RecommendedActions),
            FollowUp_Date:
              plan.FollowUp_Date && plan.FollowUp_Date.trim()
                ? plan.FollowUp_Date
                : null,
          };

          await updateTreatmentPlan(plan.PatientID, plan.VisitID, payload);
          setIsEditing(false);
        }
      }
    } catch (error) {
      console.error("Medical record error:", error.response?.data || error);
      setErrorMessage(
        `Failed to save record: ${error.response?.data?.detail || error.message}`
      );
    }
  };

  const handleAddRecord = () => {
    if (!selectedPatient?.PatientID) {
      setErrorMessage("Patient ID is missing");
      return;
    }

    setErrorMessage("");

    if (selectedType === "clinical") {
      const newNote = {
        PatientID: selectedPatient.PatientID,
        VisitID: `VISIT-${Date.now()}`,
        DocID: generateDocID(),
        VisitDate: new Date().toISOString(),
        Diagnosis: "",
        Symptoms: "",
        ClinicalNotes: "",
        Prescriptions: "",
        isNew: true,
      };

      // Calculate new index from the new array, not from stale state
      const newArray = [...clinicalNotes, newNote];
      const newIndex = newArray.length - 1;

      setClinicalNotes(newArray);
      setSelectedIndex(newIndex);
      setIsEditing(true);
      console.log("Clinical note added at index", newIndex);
    }

    if (selectedType === "diagnostic") {
      const newRecord = {
        PatientID: selectedPatient.PatientID,
        VisitID: `VISIT-${Date.now()}`,
        DocID: generateDocID(),
        TestType: "",
        Findings: "",
        ScanResult: "",
        isNew: true,
      };

      const newArray = [...diagnosticRecords, newRecord];
      const newIndex = newArray.length - 1;

      setDiagnosticRecords(newArray);
      setSelectedIndex(newIndex);
      setIsEditing(true);
      console.log("Diagnostic record added at index", newIndex);
    }

    if (selectedType === "treatment") {
      const newPlan = {
        PatientID: selectedPatient.PatientID,
        VisitID: `VISIT-${Date.now()}`,
        DocID: generateDocID(),
        RecommendedActions: "",
        FollowUp_Date: "",
        Medications: [],
        isNew: true,
      };

      const newArray = [...treatmentPlans, newPlan];
      const newIndex = newArray.length - 1;

      setTreatmentPlans(newArray);
      setSelectedIndex(newIndex);
      setIsEditing(true);
      console.log("Treatment plan added at index", newIndex);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Medical Records">
      <div className="medical-records-topbar">
        <button
          className="add-btn"
          onClick={handleAddRecord}
        >
          Add
        </button>

        <button
          className="edit-btn"
          disabled={selectedType === null}
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
              setErrorMessage("");
            }
          }}
        >
          {isEditing ? "Save" : "Edit"}
        </button>

        <button
          className="delete-btn"
          disabled={selectedType === null}
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>

      {errorMessage && (
        <div className="error-alert" style={{
          backgroundColor: "#ffebee",
          color: "#c62828",
          padding: "12px",
          marginBottom: "12px",
          borderRadius: "4px",
          borderLeft: "4px solid #c62828",
        }}>
          {errorMessage}
        </div>
      )}

      <div className="medical-records-container">
        {loading ? (
          <p>Loading medical records...</p>
        ) : (
          <>
            <div className="medical-section">
              <h3>Clinical Notes</h3>

              <div className="medical-scroll">
                {clinicalNotes.length > 0 ? (
                  clinicalNotes.map((note, index) => (
                    <div
                      key={index}
                      className={`medical-card ${
                        selectedType === "clinical" && selectedIndex === index
                          ? "selected-medical-card"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedType("clinical");
                        setSelectedIndex(index);
                        setErrorMessage("");
                      }}
                    >
                      <strong>Diagnosis:</strong>

                      {isEditing &&
                      selectedType === "clinical" &&
                      selectedIndex === index ? (
                        <input
                          className="medical-input"
                          value={safeHelpers.getRecordValue(note, "Diagnosis")}
                          onChange={(e) => {
                            setClinicalNotes((prev) => {
                              const updated = [...prev];
                              if (updated[index]) {
                                updated[index] = {
                                  ...updated[index],
                                  Diagnosis: e.target.value,
                                };
                                autosaveRecord("clinical", index, updated[index]);
                              }
                              return updated;
                            });
                          }}
                        />
                      ) : (
                        <p>{safeHelpers.getRecordValue(note, "Diagnosis", "N/A")}</p>
                      )}

                      <strong>Symptoms:</strong>

                      {isEditing &&
                      selectedType === "clinical" &&
                      selectedIndex === index ? (
                        <input
                          className="medical-input"
                          placeholder="Enter comma-separated symptoms"
                          value={formatArrayField(safeHelpers.getRecordValue(note, "Symptoms", []))}
                          onChange={(e) => {
                            setClinicalNotes((prev) => {
                              const updated = [...prev];
                              if (updated[index]) {
                                updated[index] = {
                                  ...updated[index],
                                  Symptoms: e.target.value,
                                };
                                autosaveRecord("clinical", index, updated[index]);
                              }
                              return updated;
                            });
                          }}
                        />
                      ) : (
                        <p>{formatArrayField(safeHelpers.getRecordValue(note, "Symptoms", [])) || "N/A"}</p>
                      )}

                      <strong>Clinical Notes:</strong>

                      {isEditing &&
                      selectedType === "clinical" &&
                      selectedIndex === index ? (
                        <textarea
                          className="medical-textarea"
                          value={safeHelpers.getRecordValue(note, "ClinicalNotes")}
                          onChange={(e) => {
                            setClinicalNotes((prev) => {
                              const updated = [...prev];
                              if (updated[index]) {
                                updated[index] = {
                                  ...updated[index],
                                  ClinicalNotes: e.target.value,
                                };
                                autosaveRecord("clinical", index, updated[index]);
                              }
                              return updated;
                            });
                          }}
                        />
                      ) : (
                        <p>{safeHelpers.getRecordValue(note, "ClinicalNotes", "N/A")}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div
                    className={`empty-medical-state ${
                      selectedType === "clinical" ? "selected-medical-card" : ""
                    }`}
                    onClick={() => {
                      setSelectedType("clinical");
                      setSelectedIndex(null);
                      setErrorMessage("");
                    }}
                  >
                    <p>No clinical notes found.</p>
                    <span>Click to select section</span>
                  </div>
                )}
              </div>
            </div>

            <div className="medical-section">
              <h3>Diagnostic Records</h3>

              <div className="medical-scroll">
                {diagnosticRecords.length > 0 ? (
                  diagnosticRecords.map((record, index) => (
                    <div
                      key={index}
                      className={`medical-card ${
                        selectedType === "diagnostic" && selectedIndex === index
                          ? "selected-medical-card"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedType("diagnostic");

                        setSelectedIndex(index);
                        setErrorMessage("");
                      }}
                    >
                      <strong>Test Type:</strong>

                      {isEditing &&
                      selectedType === "diagnostic" &&
                      selectedIndex === index ? (
                        <input
                          className="medical-input"
                          value={safeHelpers.getRecordValue(record, "TestType")}
                          onChange={(e) => {
                            setDiagnosticRecords((prev) => {
                              const updated = [...prev];
                              if (updated[index]) {
                                updated[index] = {
                                  ...updated[index],
                                  TestType: e.target.value,
                                };
                                autosaveRecord("diagnostic", index, updated[index]);
                              }
                              return updated;
                            });
                          }}
                        />
                      ) : (
                        <p>{safeHelpers.getRecordValue(record, "TestType", "N/A")}</p>
                      )}

                      <strong>Findings:</strong>

                      {isEditing &&
                      selectedType === "diagnostic" &&
                      selectedIndex === index ? (
                        <textarea
                          className="medical-textarea"
                          value={safeHelpers.getRecordValue(record, "Findings")}
                          onChange={(e) => {
                            setDiagnosticRecords((prev) => {
                              const updated = [...prev];
                              if (updated[index]) {
                                updated[index] = {
                                  ...updated[index],
                                  Findings: e.target.value,
                                };
                                autosaveRecord("diagnostic", index, updated[index]);
                              }
                              return updated;
                            });
                          }}
                        />
                      ) : (
                        <p>{safeHelpers.getRecordValue(record, "Findings", "N/A")}</p>
                      )}

                      <strong>Scan Result:</strong>

                      {isEditing &&
                      selectedType === "diagnostic" &&
                      selectedIndex === index ? (
                        <textarea
                          className="medical-textarea"
                          value={safeHelpers.getRecordValue(record, "ScanResult")}
                          onChange={(e) => {
                            setDiagnosticRecords((prev) => {
                              const updated = [...prev];
                              if (updated[index]) {
                                updated[index] = {
                                  ...updated[index],
                                  ScanResult: e.target.value,
                                };
                                autosaveRecord("diagnostic", index, updated[index]);
                              }
                              return updated;
                            });
                          }}
                        />
                      ) : (
                        <p>{safeHelpers.getRecordValue(record, "ScanResult", "N/A")}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div
                    className={`empty-medical-state ${
                      selectedType === "diagnostic"
                        ? "selected-medical-card"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedType("diagnostic");
                      setSelectedIndex(null);
                      setErrorMessage("");
                    }}
                  >
                    <p>No diagnostic records found.</p>

                    <span>Click to select section</span>
                  </div>
                )}
              </div>
            </div>

            <div className="medical-section">
              <h3>Treatment Plans</h3>

              <div className="medical-scroll">
                {treatmentPlans.length > 0 ? (
                  treatmentPlans.map((plan, index) => (
                    <div
                      key={index}
                      className={`medical-card ${
                        selectedType === "treatment" && selectedIndex === index
                          ? "selected-medical-card"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedType("treatment");

                        setSelectedIndex(index);
                        setErrorMessage("");
                      }}
                    >
                      <strong>Recommended Actions:</strong>

                      {isEditing &&
                      selectedType === "treatment" &&
                      selectedIndex === index ? (
                        <textarea
                          className="medical-textarea"
                          placeholder="Enter comma-separated actions"
                          value={formatArrayField(safeHelpers.getRecordValue(plan, "RecommendedActions", []))}
                          onChange={(e) => {
                            setTreatmentPlans((prev) => {
                              const updated = [...prev];
                              if (updated[index]) {
                                updated[index] = {
                                  ...updated[index],
                                  RecommendedActions: e.target.value,
                                };
                                autosaveRecord("treatment", index, updated[index]);
                              }
                              return updated;
                            });
                          }}
                        />
                      ) : (
                        <p>{formatArrayField(safeHelpers.getRecordValue(plan, "RecommendedActions", [])) || "N/A"}</p>
                      )}

                      <strong>Follow-up Date:</strong>

                      {isEditing &&
                      selectedType === "treatment" &&
                      selectedIndex === index ? (
                        <input
                          type="date"
                          className="medical-input"
                          value={safeHelpers.getRecordValue(plan, "FollowUp_Date")}
                          onChange={(e) => {
                            setTreatmentPlans((prev) => {
                              const updated = [...prev];
                              if (updated[index]) {
                                updated[index] = {
                                  ...updated[index],
                                  FollowUp_Date: e.target.value,
                                };
                                autosaveRecord("treatment", index, updated[index]);
                              }
                              return updated;
                            });
                          }}
                        />
                      ) : (
                        <p>{safeHelpers.getRecordValue(plan, "FollowUp_Date", "N/A")}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div
                    className={`empty-medical-state ${
                      selectedType === "treatment"
                        ? "selected-medical-card"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedType("treatment");
                      setSelectedIndex(null);
                      setErrorMessage("");
                    }}
                  >
                    <p>No treatment plans found.</p>

                    <span>Click to select section</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

export default MedicalRecordsModal;
