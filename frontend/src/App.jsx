import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import StudentDashboard from './pages/Student/Dashboard';
import CompanyDashboard from './pages/Company/Dashboard';
import AdminDashboard from './pages/Admin/Dashboard';
import AboutPage from './pages/Home/AboutPage';
import MessagingPage from './pages/Messaging/MessagingPage';
import ApplyPage from './pages/Apply/ApplyPage';
import { MessagingProvider } from './context/MessagingContext';

// ============================================================
// COMPOSANT PROTECTED ROUTE
// ============================================================
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // Si pas de token → redirection vers login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si des rôles sont spécifiés, vérifier que l'utilisateur a le bon rôle
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Rediriger vers le dashboard approprié ou vers login
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================
function App() {
  return (
    <MessagingProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* ROUTES PUBLIQUES */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/apply/:offerId" element={<ApplyPage />} />

            {/* ROUTES PROTÉGÉES (authentification requise) */}
            <Route
              path="/messaging"
              element={
                <ProtectedRoute>
                  <MessagingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messaging/:contactId"
              element={
                <ProtectedRoute>
                  <MessagingPage />
                </ProtectedRoute>
              }
            />

            {/* ROUTES PAR RÔLE */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/dashboard"
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <CompanyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* REDIRECTION PAR DÉFAUT */}
            <Route path="*" element={<div>404 - Page non trouvée</div>} />
          </Routes>
        </div>
      </Router>
    </MessagingProvider>
  );
}

export default App;