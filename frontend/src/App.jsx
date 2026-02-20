import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard'; // Added import
import Placement from './pages/Placement';
import Attendance from './pages/Attendance';
import Profile from './pages/Profile';
import LMS from './pages/LMS';

import Analytics from './pages/Analytics';
import Library from './pages/Library';
import Events from './pages/Events';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard/overview" replace />} /> {/* Updated redirect */}
          <Route path="overview" element={<Dashboard />} /> {/* Added route */}
          <Route path="profile" element={<Profile />} />
          <Route path="placement" element={<Placement />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="library" element={<Library />} />
          <Route path="events" element={<Events />} />
          <Route path="lms" element={<LMS />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
