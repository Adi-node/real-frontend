import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './components/dashboard';
import Footer from './components/footer';
import Navbar from './components/navbar';
import Mapping from './components/mapping';
import EHR from './components/ehr';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './components/AdminDashboard';
import PatientVisitForm from './components/PatientVisitForm';
import './App.css';

// Protected Route Component for Admins
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f9efd5] to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a5614] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return user && user.role === 'admin' ? children : <Navigate to="/" replace />;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f9efd5] to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a5614] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirects to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f9efd5] to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a5614] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? <Navigate to="/" replace /> : children;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <div className='font-inter'>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Dashboard />
                <Footer />
              </>
            </ProtectedRoute>
          } />
          <Route path="/mapping" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Mapping />
                <Footer />
              </>
            </ProtectedRoute>
          } />
          <Route path="/ehr" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <EHR />
                <Footer />
              </>
            </ProtectedRoute>
          } />
          <Route path="/patients" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <PatientVisitForm />
                <Footer />
              </>
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <>
                <Navbar />
                <AdminDashboard />
                <Footer />
              </>
            </AdminRoute>
          } />

          {/* Catch all - redirect to dashboard if logged in, login if not */}
          <Route path="*" element={
            user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
          } />
        </Routes>
      </Router>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
