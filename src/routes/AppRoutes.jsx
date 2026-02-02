
import { BrowserRouter, Route, Routes } from "react-router-dom";


import ProtectedRoute from "./ProtectedRoute";

/* ================= ADMIN ================= */
import AdminLayout from "../layout/AdminLayout";
import AdminAttendance from "../pages/admin/Attendance";
import Complaint from "../pages/admin/complaints";
import AdminDashboard from "../pages/admin/dashboard";
import FuelManagement from "../pages/admin/fuel-management";
import SupervisorManagement from "../pages/admin/supervisors";
import TrackVehicle from "../pages/admin/track-vehicles";
import Vehicle from "../pages/admin/vehicles";
import Ward from "../pages/admin/wards";
import WasteCollection from "../pages/admin/wastecollection";

/* ================= CITIZEN ================= */
import CitizenLayout from "../layout/CitizenLayout";
import CitizenDashboard from "../pages/citizen/dashboard/CitizenDashboard";
import ComplaintsPage from "../pages/citizen/complaints/ComplaintsPage";
import TrackVehiclePage from "../pages/citizen/trackvehicle/CitizenTrackVehicle";
import ServiceBookingApp from "../pages/citizen/onlineservice/OnlineService";
import CitizenCheckpoint from "../pages/citizen/checkpoint/CitizenCheckpoint";


/* ================= SUPERVISOR ================= */

import SupervisorLayout from "../layout/supervisor/SupervisorLayout";
import Login from "../pages/auth/login/Login";
import Analytics from "../pages/supervisor/analytics/Analytics";
import Attendance from "../pages/supervisor/attendance/Attendance";
import Complaints from "../pages/supervisor/complaints/Complaints";
import SupervisorDashboard from "../pages/supervisor/dashboard/SupervisorDashboard";
import MachineryDefect from "../pages/supervisor/machineryDefect/MachineryDefect";
import MoKhataDashboard from "../pages/supervisor/mokhata/MoKhataDashboard";
import Vehicles from "../pages/supervisor/vehicles/Vehicles";
import WealthCenter from "../pages/supervisor/wealthcenter/WealthCenter";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= LOGIN ================= */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="complaints" element={<Complaint />} />
          <Route path="vehicles" element={<Vehicle />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="wards" element={<Ward />} />
          <Route path="supervisors" element={<SupervisorManagement />} />
          <Route path="track-vehicles" element={<TrackVehicle />} />
          <Route path="waste-collection" element={<WasteCollection />} />
          <Route path="fuel-management" element={<FuelManagement />} />
        </Route>

        {/* ================= CITIZEN ROUTES ================= */}
        <Route
          path="/citizen"
          element={
            <ProtectedRoute allowedRoles={["citizen"]}>
              <CitizenLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CitizenDashboard />} />
          <Route path="complaint" element={<ComplaintsPage />} />
          <Route path="track" element={<TrackVehiclePage />} />
          <Route path="payments" element={<ServiceBookingApp />} />
          <Route path="checkpoint" element={<CitizenCheckpoint />} />
        </Route>

        {/* ================= SUPERVISOR ROUTES ================= */}
        <Route
          path="/supervisor"
          element={
            <ProtectedRoute allowedRoles={["supervisor"]}>
              {/* <SupervisorLayout /> */}
              <SupervisorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SupervisorDashboard />} />
          <Route path="dashboard" element={<SupervisorDashboard />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="live-tracking" element={<TrackVehicle />} />
          <Route path="wealthcenter" element={<WealthCenter />} />
          <Route path="machinery-defect" element={<MachineryDefect />} />
          <Route path="mokhata" element={<MoKhataDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
