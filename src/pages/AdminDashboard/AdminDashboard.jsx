import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, templatesData] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
        adminService.getTemplates()
      ]);
      setStats(statsData);
      setUsers(usersData);
      setTemplates(templatesData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const logs = await adminService.getAuditLogs();
      setAuditLogs(logs);
    } catch (error) {
      toast.error('Failed to load audit logs');
    }
  };

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchAuditLogs();
    }
  }, [activeTab]);

  const handleToggleUser = async (user) => {
    try {
      await adminService.updateUserStatus(user.id, !user.active);
      toast.success(`User ${user.active ? 'suspended' : 'reactivated'}`);
      setUsers(users.map(u => u.id === user.id ? { ...u, active: !u.active } : u));
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleChangePlan = async (userId, plan) => {
    try {
      await adminService.updateUserPlan(userId, plan);
      toast.success(`Plan updated to ${plan}`);
      setUsers(users.map(u => u.id === userId ? { ...u, subscriptionPlan: plan } : u));
    } catch (error) {
      toast.error('Failed to update plan');
    }
  };

  const renderOverview = () => (
    <div className="admin-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-value">{stats?.totalUsers || 0}</p>
          <span className="stat-label">Active: {stats?.activeUsers || 0}</span>
        </div>
        <div className="stat-card">
          <h3>Total Resumes</h3>
          <p className="stat-value">{stats?.totalResumes || 0}</p>
          <span className="stat-label">Created this week</span>
        </div>
        <div className="stat-card">
          <h3>Templates</h3>
          <p className="stat-value">{stats?.totalTemplates || 0}</p>
          <span className="stat-label">Active designs</span>
        </div>
        <div className="stat-card highlight">
          <h3>AI Usage</h3>
          <p className="stat-value">1.2M</p>
          <span className="stat-label">Tokens consumed</span>
        </div>
      </div>
      
      <div className="activity-section">
        <div className="card">
          <h4>Recent Activity</h4>
          <div className="activity-placeholder">
            {/* Chart would go here */}
            <p>User Growth Visualization</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="admin-users">
      <div className="card">
        <div className="card-header">
          <h4>User Management</h4>
          <input type="text" placeholder="Search users..." className="search-input" />
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-cell">
                    <span className="user-name">{user.fullName}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                </td>
                <td><span className={`badge ${user.role}`}>{user.role.replace('ROLE_', '')}</span></td>
                <td>
                  <select 
                    value={user.subscriptionPlan} 
                    onChange={(e) => handleChangePlan(user.id, e.target.value)}
                    className="plan-select"
                  >
                    <option value="FREE">FREE</option>
                    <option value="PREMIUM">PREMIUM</option>
                  </select>
                </td>
                <td>
                  <span className={`status-dot ${user.active ? 'active' : 'inactive'}`}></span>
                  {user.active ? 'Active' : 'Suspended'}
                </td>
                <td>
                  <div className="action-btns">
                    <button onClick={() => handleToggleUser(user)} className="btn-icon">
                      {user.active ? 'Suspend' : 'Reactivate'}
                    </button>
                    <button className="btn-icon danger">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="admin-templates">
      <div className="header-actions">
        <h4>Template Management</h4>
        <button className="btn-primary">Add New Template</button>
      </div>
      <div className="templates-grid">
        {templates.map(template => (
          <div key={template.id} className="template-admin-card">
            <div className="template-thumb">
              {template.thumbnailUrl ? <img src={template.thumbnailUrl} alt="" /> : <div className="thumb-placeholder" />}
            </div>
            <div className="template-info">
              <h5>{template.name}</h5>
              <span className="template-cat">{template.category}</span>
              <div className="template-status">
                <span className={`badge ${template.isPremium ? 'premium' : 'free'}`}>{template.isPremium ? 'Premium' : 'Free'}</span>
                <span className={`badge ${template.isActive ? 'active' : 'inactive'}`}>{template.isActive ? 'Active' : 'Draft'}</span>
              </div>
              <div className="template-actions">
                <button className="btn-outline">Edit Code</button>
                <button className="btn-outline danger">Deactivate</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="admin-logs">
      <div className="card">
        <h4>System Audit Logs</h4>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Admin</th>
              <th>Target</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map(log => (
              <tr key={log.id}>
                <td className="log-time">{new Date(log.timestamp).toLocaleString()}</td>
                <td><span className="log-action">{log.action}</span></td>
                <td>{log.performedBy}</td>
                <td>{log.targetUser || '-'}</td>
                <td className="log-details">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) return <div className="admin-loading">Loading Management Suite...</div>;

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="logo-mark">R</span>
          <span>Admin<strong>Center</strong></span>
        </div>
        <nav className="admin-nav">
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Users</button>
          <button className={activeTab === 'templates' ? 'active' : ''} onClick={() => setActiveTab('templates')}>Templates</button>
          <button className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>Analytics</button>
          <button className={activeTab === 'logs' ? 'active' : ''} onClick={() => setActiveTab('logs')}>Audit Logs</button>
          <button className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}>Notifications</button>
        </nav>
        <div className="admin-footer">
          <button onClick={() => navigate('/dashboard')} className="btn-back">Back to App</button>
        </div>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Control</h2>
          <div className="admin-user-info">
            <span>Admin Control Panel</span>
          </div>
        </header>

        <div className="tab-container">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'templates' && renderTemplates()}
          {activeTab === 'logs' && renderLogs()}
          {/* Add more tabs as needed */}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
