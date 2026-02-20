import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Student Layout & Pages
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Placement from "./pages/Placement";
import Attendance from "./pages/Attendance";
import Analytics from "./pages/Analytics";
import Library from "./pages/Library";
import Events from "./pages/Events";
import Hostel from "./pages/Hostel";
import LMS from "./pages/LMS";

// Faculty Layout & Pages
import FacultyLayout from "./components/layout/FacultyLayout";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import ManageAttendance from "./pages/faculty/ManageAttendance";
import ManageStudents from "./pages/faculty/ManageStudents";
import ManageEvents from "./pages/faculty/ManageEvents";
import ManageLibrary from "./pages/faculty/ManageLibrary";
import ManageHostel from "./pages/faculty/ManageHostel";
import ManagePlacements from "./pages/faculty/ManagePlacements";
import AdminPanel from "./pages/faculty/AdminPanel";
import ManageClasses from "./pages/faculty/ManageClasses";

// Auth
import Login from "./pages/Login";

const STUDENT_ROLES = ["student"];
const FACULTY_ROLES = ["faculty", "event_manager", "librarian", "hostel_warden", "tpo", "admin"];

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Student Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard/overview" replace />} />
            <Route path="overview" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="placement" element={<Placement />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="library" element={<Library />} />
            <Route path="events" element={<Events />} />
            <Route path="hostel" element={<Hostel />} />
            <Route path="lms" element={<LMS />} />
          </Route>

          {/* Faculty/Admin Routes */}
          <Route
            path="/faculty"
            element={
              <ProtectedRoute allowedRoles={FACULTY_ROLES}>
                <FacultyLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/faculty/dashboard" replace />} />
            <Route path="dashboard" element={<FacultyDashboard />} />
            <Route path="attendance" element={<ManageAttendance />} />
            <Route path="students" element={<ManageStudents />} />
            <Route path="classes" element={<ManageClasses />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="library" element={<ManageLibrary />} />
            <Route path="hostel" element={<ManageHostel />} />
            <Route path="placements" element={<ManagePlacements />} />
            <Route path="admin" element={<AdminPanel />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
