import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import adminService from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import UniversalTemplate from '../ResumeBuilder/utils/UniversalTemplate';
import ProfilePage from '../../components/dashboard/ProfilePage';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
        // We don't toast here to avoid spamming the user if multiple services are down
      }
    };

    await Promise.all([
      safeFetch(adminService.getStats, setStats, 'stats'),
      safeFetch(adminService.getUsers, setUsers, 'users'),
      safeFetch(adminService.getTemplates, setTemplates, 'templates'),
      safeFetch(adminService.getAuditLogs, setAuditLogs, 'logs'),
      safeFetch(adminService.getGrowthStats, setGrowthData, 'growth')
    ]);
    
    setLoading(false);
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

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleToggleUser = async (user) => {
    try {
      await adminService.updateUserStatus(user.userId, !user.active);
      toast.success(`User ${user.active ? 'suspended' : 'reactivated'}`);
      setUsers(users.map(u => u.userId === user.userId ? { ...u, active: !u.active } : u));
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleChangePlan = async (userId, plan) => {
    try {
      await adminService.updateUserPlan(userId, plan);
      toast.success(`Plan updated to ${plan}`);
      // Refresh user list to see aligned role changes if any
      const updatedUsers = await adminService.getUsers();
      setUsers(updatedUsers);
    } catch (error) {
      toast.error('Failed to update plan');
    }
  };

  const handleChangeRole = async (userId, role) => {
    try {
      await adminService.updateUserRole(userId, role);
      toast.success(`Role updated to ${role.replace('ROLE_', '')}`);
      // Refresh user list to see aligned plan changes
      const updatedUsers = await adminService.getUsers();
      setUsers(updatedUsers);
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user permanently?')) return;
    try {
      await adminService.deleteUser(userId);
      toast.success('User deleted successfully');
      setUsers(users.filter(u => u.userId !== userId));
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ fullName: '', email: '', password: '', role: 'ROLE_USER', subscriptionPlan: 'FREE' });

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await adminService.createUser(newUser);
      toast.success('User created successfully');
      setShowAddModal(false);
      fetchInitialData();
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState({ 
    name: '', 
    category: 'PROFESSIONAL', 
    isPremium: false, 
    isActive: true,
    description: '',
    htmlLayout: '',
    cssStyles: ''
  });

  const handleOpenTemplateModal = (template = null) => {
    if (template) {
      setEditingTemplate(template);
      setTemplateForm({
        name: template.name,
        category: template.category,
        isPremium: template.isPremium,
        isActive: template.isActive,
        description: template.description || '',
        htmlLayout: template.htmlLayout || '',
        cssStyles: template.cssStyles || ''
      });
    } else {
      setEditingTemplate(null);
      setTemplateForm({ 
        name: '', 
        category: 'PROFESSIONAL', 
        isPremium: false, 
        isActive: true,
        description: '',
        htmlLayout: '',
        cssStyles: ''
      });
    }
    setShowTemplateModal(true);
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        await adminService.updateTemplate(editingTemplate.templateId, templateForm);
        toast.success('Template updated successfully');
      } else {
        await adminService.createTemplate(templateForm);
        toast.success('Template added successfully');
      }
      setShowTemplateModal(false);
      fetchInitialData();
    } catch (error) {
      toast.error('Failed to save template');
    }
  };

  const handleToggleTemplateStatus = async (templateId, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'reactivate';
    if (!window.confirm(`Are you sure you want to ${action} this template?`)) return;
    try {
      await adminService.toggleTemplateStatus(templateId);
      toast.success(`Template ${action}d`);
      fetchInitialData();
    } catch (error) {
      toast.error(`Failed to ${action} template`);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm('Are you sure you want to PERMANENTLY DELETE this template? This cannot be undone.')) return;
    try {
      await adminService.deleteTemplate(templateId);
      toast.success('Template deleted successfully');
      fetchInitialData();
    } catch (error) {
      toast.error('Failed to delete template');
    }
  };

  const [broadcastMsg, setBroadcastMsg] = useState('');
  const handleBroadcast = async () => {
    if (!broadcastMsg.trim()) return;
    try {
      await adminService.sendBroadcast({ message: broadcastMsg });
      toast.success('Broadcast sent to all users');
      setBroadcastMsg('');
    } catch (error) {
      toast.error('Failed to send broadcast');
    }
  };

  const processedGrowthData = React.useMemo(() => {
    if (growthData && growthData.length > 0) {
      return growthData.map(d => ({
        date: new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        users: d.users
      }));
    }
    // Fallback to empty or base stats if no history yet
    return [{ date: 'Today', users: stats?.totalUsers || 0 }];
  }, [growthData, stats]);

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
          <div className="activity-list">
            {auditLogs.slice(0, 6).map(log => (
              <div key={log.id} className="activity-item">
                <div className="activity-icon">
                  {log.action.includes('USER') ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  ) : log.action.includes('TEMPLATE') ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  )}
                </div>
                <div className="activity-info">
                  <p className="activity-text">
                    <strong>{log.performedBy}</strong> {log.action.toLowerCase().replace('_', ' ')} 
                    {log.targetUser && <> for <strong>{log.targetUser}</strong></>}
                  </p>
                  <span className="activity-time">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
            {auditLogs.length === 0 && <p className="empty-msg">No recent activity found.</p>}
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
          <div className="header-actions">
            <input type="text" placeholder="Search users..." className="search-input" />
            <button className="btn-primary" onClick={() => setShowAddModal(true)}>Add New User</button>
          </div>
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
              <tr key={user.userId}>
                <td>
                  <div className="user-cell">
                    <span className="user-name">{user.fullName}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                </td>
                <td>
                  <select 
                    value={user.role || 'ROLE_USER'} 
                    onChange={(e) => handleChangeRole(user.userId, e.target.value)}
                    className="role-select"
                  >
                    <option value="ROLE_USER">USER</option>
                    <option value="ROLE_FREE">FREE</option>
                    <option value="ROLE_PREMIUM">PREMIUM</option>
                    <option value="ROLE_ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>
                  <select 
                    value={user.subscriptionPlan || 'FREE'} 
                    onChange={(e) => handleChangePlan(user.userId, e.target.value)}
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
                    <button onClick={() => handleDeleteUser(user.userId)} className="btn-icon danger">Delete</button>
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
      <div className="card-header">
        <h4>Template Management</h4>
        <button className="btn-primary" onClick={() => handleOpenTemplateModal()}>Add New Template</button>
      </div>
      <div className="templates-grid">
        {templates.map(template => (
          <div key={template.templateId} className="template-admin-card">
            <div className="template-thumb">
              <div className="mini-preview-scaler">
                <UniversalTemplate 
                  template={template} 
                  data={{
                    fullName: 'John Doe',
                    jobTitle: 'Software Engineer',
                    email: 'john@example.com',
                    phone: '+1 234 567 890',
                    location: 'New York, NY',
                    summary: 'Experienced professional with a focus on modern web technologies.',
                    experience: [
                      { role: 'Senior Developer', company: 'Tech Corp', startDate: '2020', endDate: 'Present', description: 'Leading frontend architecture and team development.' }
                    ],
                    skills: ['React', 'Node.js', 'System Design']
                  }} 
                />
              </div>
            </div>
            <div className="template-info">
              <h5>{template.name}</h5>
              <span className="template-cat">{template.category}</span>
              <div className="template-status">
                <span className={`badge ${template.isPremium ? 'premium' : 'free'}`}>{template.isPremium ? 'Premium' : 'Free'}</span>
                <span className={`badge ${template.isActive ? 'active' : 'inactive'}`}>{template.isActive ? 'Active' : 'Draft'}</span>
              </div>
              <div className="template-actions">
                <button className="btn-outline" onClick={() => handleOpenTemplateModal(template)}>Edit Layout</button>
                <button 
                  className={`btn-outline ${template.isActive ? 'warning' : 'success'}`} 
                  onClick={() => handleToggleTemplateStatus(template.templateId, template.isActive)}
                >
                  {template.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button className="btn-outline danger" onClick={() => handleDeleteTemplate(template.templateId)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="admin-analytics">
      <div className="analytics-grid">
        <div className="card">
          <h4>User Growth (Last 30 Days)</h4>
          <div className="chart-container" style={{ width: '100%', height: '300px', marginTop: '20px', minHeight: '300px' }}>
            <ResponsiveContainer width="99%" height="100%">
              <AreaChart data={processedGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }} 
                  interval={5}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    fontSize: '12px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorUsers)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <h4>Role Distribution</h4>
          <div className="distribution-list" style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span>Free Users</span>
              <strong>75%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span>Premium Users</span>
              <strong>22%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Admins</span>
              <strong>3%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="admin-notifications">
      <div className="notification-manager">
        <div className="card broadcast-card">
          <h4>System Broadcast</h4>
          <p className="subtitle">Send a notification to all active users</p>
          <textarea 
            placeholder="Type your message here..." 
            value={broadcastMsg}
            onChange={(e) => setBroadcastMsg(e.target.value)}
          />
          <button className="btn-primary" onClick={handleBroadcast}>Send Broadcast</button>
        </div>
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
          <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>My Profile</button>
        </nav>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <div className="header-left">
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Control</h2>
            <p className="header-subtitle">ResumeAI Platform Administration</p>
          </div>
          <div className="admin-user-profile" onClick={() => setActiveTab('profile')} style={{ cursor: 'pointer' }}>
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
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'templates' && renderTemplates()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'notifications' && renderNotifications()}
          {activeTab === 'logs' && renderLogs()}
          {activeTab === 'profile' && (
            <ProfilePage 
              user={user} 
              userRole="System Administrator" 
              resumeCount={0} 
              score={0} 
              onBack={() => setActiveTab('overview')}
              onSaveProfile={fetchInitialData}
            />
          )}
        </div>

        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Create New User</h3>
              <form onSubmit={handleAddUser}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" required value={newUser.fullName} onChange={(e) => setNewUser({...newUser, fullName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" required value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" required value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                    <option value="ROLE_USER">User</option>
                    <option value="ROLE_ADMIN">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Initial Plan</label>
                  <select value={newUser.subscriptionPlan} onChange={(e) => setNewUser({...newUser, subscriptionPlan: e.target.value})}>
                    <option value="FREE">FREE</option>
                    <option value="PREMIUM">PREMIUM</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary">Create User</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showTemplateModal && (
          <div className="modal-overlay">
            <div className="modal-content wide-modal">
              <h3>{editingTemplate ? 'Edit Template Layout' : 'Add New Template'}</h3>
              <form onSubmit={handleSaveTemplate}>
                <div className="modal-grid">
                  <div className="modal-sidebar">
                    <div className="form-group">
                      <label>Template Name</label>
                      <input type="text" required value={templateForm.name} onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select value={templateForm.category} onChange={(e) => setTemplateForm({...templateForm, category: e.target.value})}>
                        <option value="PROFESSIONAL">Professional</option>
                        <option value="CREATIVE">Creative</option>
                        <option value="MODERN">Modern</option>
                        <option value="MINIMALIST">Minimalist</option>
                        <option value="ATS-OPTIMISED">ATS-Optimised</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea value={templateForm.description} onChange={(e) => setTemplateForm({...templateForm, description: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="checkbox" checked={templateForm.isPremium} onChange={(e) => setTemplateForm({...templateForm, isPremium: e.target.checked})} />
                        Premium Template
                      </label>
                    </div>
                  </div>
                  
                  <div className="modal-main-editor">
                    <div className="form-group">
                      <label>HTML Layout (Mustache.js Format)</label>
                      <textarea 
                        className="code-editor"
                        required 
                        value={templateForm.htmlLayout} 
                        onChange={(e) => setTemplateForm({...templateForm, htmlLayout: e.target.value})} 
                        placeholder="<div class='resume'>...</div>"
                      />
                    </div>
                    <div className="form-group">
                      <label>CSS Styles</label>
                      <textarea 
                        className="code-editor"
                        required 
                        value={templateForm.cssStyles} 
                        onChange={(e) => setTemplateForm({...templateForm, cssStyles: e.target.value})} 
                        placeholder=".resume { ... }"
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowTemplateModal(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary">{editingTemplate ? 'Update Template' : 'Create Template'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
