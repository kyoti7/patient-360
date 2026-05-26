import "../css/StatusBadge.css";

const StatusBadge = ({ status }) => {
  const getStatusClass = () => {
    switch (status.toLowerCase()) {
      case "completed":
      case "paid":
      case "available":
      case "admitted":
        return "status-success";

      case "pending":
      case "scheduled":
      case "ongoing":
        return "status-warning";

      case "cancelled":
      case "discharged":
      case "unavailable":
        return "status-danger";

      case "on leave":
        return "status-neutral";

      default:
        return "status-default";
    }
  };

  return <span className={`status-badge ${getStatusClass()}`}>{status}</span>;
};

export default StatusBadge;
