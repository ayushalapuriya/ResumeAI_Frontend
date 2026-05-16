import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import adminService from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import AdminSidebar from './components/AdminSidebar';
import Breadcrumbs from './components/Breadcrumbs';
import './AdminDashboard.css';

const AdminLayout = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    const safeFetch = async (fetchFn, setter, label) => {
      try {
        const data = await fetchFn();
        setter(data);
      } catch (err) {
        console.error(`Error loading ${label}:`, err);
      }
    };

    await Promise.all([
      safeFetch(adminService.getStats, setStats, 'stats'),
      safeFetch(adminService.getUsers, setUsers, 'users'),
      safeFetch(adminService.getTemplates, setTemplates, 'templates'),
      safeFetch(adminService.getAuditLogs, setAuditLogs, 'logs')
    ]);
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) return <div className="admin-loading">Loading Management Suite...</div>;

  // Calculate section title based on route
  const currentPath = location.pathname.split('/').pop() || 'overview';
  const sectionTitle = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);

  return (
    <div className="admin-dashboard">
      <AdminSidebar user={user} />

      <main className="admin-content">
        <header className="admin-header">
          <div className="header-left">
            <Breadcrumbs />
            <h2>{sectionTitle} Control</h2>
            <p className="header-subtitle">ResumeAI Platform Administration</p>
          </div>
          <div className="admin-user-profile" onClick={() => navigate('/admin/profile')} style={{ cursor: 'pointer' }}>
            <div className="admin-avatar">
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="Admin" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                user?.fullName?.charAt(0) || 'A'
              )}
            </div>
            <div className="admin-info">
              <span className="admin-name">{user?.fullName || 'Administrator'}</span>
              <span className="admin-role">System Admin</span>
            </div>
            <button onClick={(e) => { e.stopPropagation(); handleLogout(); }} className="btn-logout">Logout</button>
          </div>
        </header>

        <div className="tab-container">
          <Outlet context={{ 
            stats, users, setUsers, templates, auditLogs, fetchInitialData, user 
          }} />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
