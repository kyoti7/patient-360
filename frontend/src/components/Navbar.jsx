import { Bell, ChevronDown, Stethoscope } from "lucide-react";
import "./css/Navbar.css";

// ─── NAVBAR ────────────────────────────────────────────────── Header
const Navbar = () => {
  return (
    <header className="navbar">
      <div></div>

      <div className="navbar-right">
        <button className="notification-btn">
          <Bell size={20} />
        </button>

        <div className="profile-section">
          <div className="profile-avatar">
            <Stethoscope size={24} />
          </div>

          <div className="profile-info">
            <h4>Admin User</h4>
            <p>Administrator</p>
          </div>

          <ChevronDown size={18} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
