import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import HealthDashboard from './pages/HealthDashboard';
import InsuranceCenter from './pages/InsuranceCenter';
import MedicalBooking from './pages/MedicalBooking';
import Community from './pages/Community';
import AppLayout from './components/AppLayout';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
          <Route path="/dashboard"  element={<Dashboard />} />
          <Route path="/health"     element={<HealthDashboard />} />
          <Route path="/insurance"  element={<InsuranceCenter />} />
          <Route path="/booking"    element={<MedicalBooking />} />
          <Route path="/community"  element={<Community />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
