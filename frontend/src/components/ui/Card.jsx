import "../css/DashboardCards.css";

const Card = ({ title, value, subtitle, className = "" }) => {
  return (
    <div className={`dashboard-card ${className}`}>
      <div className="card-content">
        <p className="card-title">{title}</p>

        <h2 className="card-value">{value}</h2>

        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default Card;
