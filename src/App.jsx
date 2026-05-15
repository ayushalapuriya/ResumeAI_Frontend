import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardFree from './pages/DashboardFree';
import DashboardPremium from './pages/DashboardPremium';
import ResumeBuilder from './pages/ResumeBuilder/ResumeBuilder';
import TemplatesPage from './pages/TemplatesPage';
import Pricing from './pages/Pricing';
import AdminLayout from './pages/AdminDashboard/AdminLayout';
import Overview from './pages/AdminDashboard/modules/Overview';
import UserManagement from './pages/AdminDashboard/modules/UserManagement';
import UserCreate from './pages/AdminDashboard/modules/UserCreate';
import TemplateManagement from './pages/AdminDashboard/modules/TemplateManagement';
import TemplateCreate from './pages/AdminDashboard/modules/TemplateCreate';
import TemplateEdit from './pages/AdminDashboard/modules/TemplateEdit';
import Analytics from './pages/AdminDashboard/modules/Analytics';
import AuditLogs from './pages/AdminDashboard/modules/AuditLogs';
import Broadcast from './pages/AdminDashboard/modules/Broadcast';
import AdminProfile from './pages/AdminDashboard/modules/AdminProfile';
import ViewResume from './pages/ViewResume';
import './App.css';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="loading-screen">Loading...</div>;
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const p = window.location.pathname;
    const plan = (user.subscriptionPlan || user.subscription_plan || '').toUpperCase();
    const role = (user.role || '').toUpperCase();
    const isPremium = role === 'ROLE_PREMIUM' || plan === 'PREMIUM';

    if (role === 'ROLE_ADMIN' && !p.startsWith('/admin')) return <Navigate to="/admin" />;
    
    // If they are premium but on free dashboard, move them
    if (isPremium && p.startsWith('/dashboard/free')) return <Navigate to="/dashboard/premium" />;
    
    // If they are free but trying to access premium, block them
    if (!isPremium && p.startsWith('/dashboard/premium')) return <Navigate to="/dashboard/free" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          {!window.location.pathname.startsWith('/view/') && <Navbar />}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/view/:resumeId" element={<ViewResume />} />

            {/* Free User Routes */}
            <Route path="/dashboard/free/*" element={
              <RoleProtectedRoute allowedRoles={['ROLE_FREE']}>
                <DashboardFree />
              </RoleProtectedRoute>
            } />

            {/* Premium User Routes */}
            <Route path="/dashboard/premium/*" element={
              <RoleProtectedRoute allowedRoles={['ROLE_PREMIUM']}>
                <DashboardPremium />
              </RoleProtectedRoute>
            } />

            {/* Shared Protected Routes (Resume Builder) */}
            <Route path="/resume-builder" element={
              <RoleProtectedRoute allowedRoles={['ROLE_FREE', 'ROLE_PREMIUM']}>
                <ResumeBuilder />
              </RoleProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <RoleProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminLayout />
              </RoleProtectedRoute>
            }>
              <Route index element={<Overview />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="users/create" element={<UserCreate />} />
              <Route path="templates" element={<TemplateManagement />} />
              <Route path="templates/create" element={<TemplateCreate />} />
              <Route path="templates/:templateId/edit" element={<TemplateEdit />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="logs" element={<AuditLogs />} />
              <Route path="notifications" element={<Broadcast />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>

            {/* Default Dashboard Redirect */}
            <Route path="/dashboard" element={
               <RoleProtectedRoute>
                 <DashboardRedirect />
               </RoleProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  
  if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin" />;
  
  const plan = (user.subscriptionPlan || user.subscription_plan || '').toUpperCase();
  const role = (user.role || '').toUpperCase();
  const isPremium = role === 'ROLE_PREMIUM' || plan === 'PREMIUM';
  
  if (isPremium) return <Navigate to="/dashboard/premium" />;
  
  return <Navigate to="/dashboard/free" />;
};

export default App;
