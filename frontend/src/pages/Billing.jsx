import { useEffect, useState } from "react";
import SearchInput from "../components/ui/SearchInput";
import StatusBadge from "../components/ui/StatusBadge";
import Card from "../components/ui/Card";
import AddBillingModal from "./modal/Billing/AddBillingModal";
import EditBillingModal from "./modal/Billing/EditBillingModal";
import DeleteBillingModal from "./modal/Billing/DeleteBillingModal";
import { getBillings } from "../services/billingService";
import "./css/Billing/Billing.css";

// ─── MAIN ──────────────────────────────────────────────────── Display
function Billing() {
  const [billings, setBillings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBilling, setSelectedBilling] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ─── FETCH ──────────────────────────────────────────────── Data
  useEffect(() => {
    const loadBillings = async () => {
      try {
        const data = await getBillings();
        setBillings(data.billings);
      } catch (error) {
        console.log(error);
      }
    };

    loadBillings();
  }, []);

  // ─── REFRESH ────────────────────────────────────────────── Reload
  const refreshBillings = async () => {
    try {
      const data = await getBillings();
      setBillings(data.billings);
    } catch (error) {
      console.log(error);
    }
  };

  // ─── FILTERS ────────────────────────────────────────────── Logic
  const filteredBillings = billings.filter((billing) => {
    const matchesSearch =
      billing.BillingID.toLowerCase().includes(search.toLowerCase()) ||
      billing.PatientName?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || billing.PaymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ─── STATS ──────────────────────────────────────────────── Count
  const totalBillings = billings.length;
  const paidBillings = billings.filter(
    (billing) => billing.PaymentStatus === "Paid",
  ).length;
  const pendingBillings = billings.filter(
    (billing) => billing.PaymentStatus === "Pending",
  ).length;
  const partialBillings = billings.filter(
    (billing) => billing.PaymentStatus === "Partially Paid",
  ).length;

  return (
    <div className="billing-page">
      <div className="billing-header">
        <div>
          <h1 className="billing-title">Billing</h1>

          <p className="billing-subtitle">
            Manage billing records and monitor payment statuses
          </p>
        </div>

        <div className="billing-toolbar">
          <button className="primary-btn" onClick={() => setShowAddModal(true)}>
            Add Billing
          </button>

          <button
            className={`secondary-btn ${
              !selectedBilling ? "disabled-btn" : ""
            }`}
            disabled={!selectedBilling}
            onClick={() => setShowEditModal(true)}
          >
            Edit
          </button>

          <button
            className={`danger-btn ${!selectedBilling ? "disabled-btn" : ""}`}
            disabled={!selectedBilling}
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>

          <SearchInput
            placeholder="Search billing..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="billing-search"
          />

          <select
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>

            <option value="Paid">Paid</option>

            <option value="Pending">Pending</option>

            <option value="Partially Paid">Partially Paid</option>
          </select>
        </div>
      </div>

      <div className="summary-cards">
        <Card title="Total Bills" value={totalBillings} />

        <Card title="Paid" value={paidBillings} className="green-card" />

        <Card title="Pending" value={pendingBillings} className="red-card" />

        <Card
          title="Partially Paid"
          value={partialBillings}
          className="blue-card"
        />
      </div>

      <div className="billing-table-container">
        <table className="billing-table">
          <thead>
            <tr>
              <th>Billing ID</th>

              <th>Visit ID</th>

              <th>Patient Name</th>

              <th>Total Amount</th>

              <th>Status</th>

              <th>Billing Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredBillings.map((billing) => (
              <tr
                key={billing.BillingID}
                onClick={() => setSelectedBilling(billing)}
                className={
                  selectedBilling?.BillingID === billing.BillingID
                    ? "selected-row"
                    : ""
                }
              >
                <td className="billing-id">{billing.BillingID}</td>
                <td>{billing.VisitID}</td>
                <td>{billing.PatientName}</td>
                <td>₱{billing.TotalAmount ? billing.TotalAmount : 0}</td>
                <td>
                  <StatusBadge status={billing.PaymentStatus} />
                </td>
                <td>
                  {billing.BillingDate
                    ? new Date(billing.BillingDate).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddBillingModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        refreshBillings={refreshBillings}
      />

      <EditBillingModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        selectedBilling={selectedBilling}
        setSelectedBilling={setSelectedBilling}
        refreshBillings={refreshBillings}
      />

      <DeleteBillingModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedBilling(null);
        }}
        selectedBilling={selectedBilling}
        refreshBillings={refreshBillings}
        clearSelectedBilling={() => setSelectedBilling(null)}
      />
    </div>
  );
}

export default Billing;
