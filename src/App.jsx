import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import WorkerDashboard from './WorkerDashboard';
import NewAdminDashboard from './NewAdminDashboard';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/worker-dashboard" element={<WorkerDashboard />} />
          <Route path="/admin-dashboard" element={<NewAdminDashboard />} />
          <Route path="/emergency" element={<div className="min-h-screen bg-red-600 flex items-center justify-center text-white text-2xl font-bold">EMERGENCY MODE ACTIVATED</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;