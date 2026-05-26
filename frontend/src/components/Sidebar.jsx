import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  LayoutDashboard,
  Users,
  UserRoundCog,
  CalendarDays,
  MapPin,
  Wallet,
} from "lucide-react";
import "./css/Sidebar.css";

// ─── NAVIGATION ────────────────────────────────────────────── Routes
const navItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Patients",
    path: "/patients",
    icon: Users,
  },
  {
    name: "Doctors",
    path: "/doctors",
    icon: UserRoundCog,
  },
  {
    name: "Appointments",
    path: "/appointments",
    icon: CalendarDays,
  },
  {
    name: "Visits",
    path: "/visits",
    icon: MapPin,
  },
  {
    name: "Billing",
    path: "/billing",
    icon: Wallet,
  },
];

// ─── SIDEBAR ────────────────────────────────────────────────── Menu
const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo-section">
          <img src={logo} alt="Patient 360 Logo" className="sidebar-logo" />
          <h2>Patient 360</h2>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                <Icon size={22} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer">
        <p>Need Help?</p>

        <button
          className="support-btn"
          onClick={() =>
            alert(
              "Contact Support\n\nEmail: support@patient360.com\nPhone: +63 935 125 7126",
            )
          }
        >
          Contact Support
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
