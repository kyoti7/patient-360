import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard";
import Patients from "../pages/Patients";
import Doctors from "../pages/Doctors";
import Appointments from "../pages/Appointments";
import Visits from "../pages/Visits";
import Billing from "../pages/Billing";

// ─── ROUTES ────────────────────────────────────────────────── Paths
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="visits" element={<Visits />} />
        <Route path="billing" element={<Billing />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
