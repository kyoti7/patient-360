import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../components/css/Layout.css";

// ─── LAYOUT ────────────────────────────────────────────────── Wrapper
const MainLayout = () => {
  return (
    <div className="layout">
      <Sidebar />

      <div className="main-wrapper">
        <Navbar />

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
