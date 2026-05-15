import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import notificationService from '../../services/notificationService';
import NotificationsCenter from './NotificationsCenter';
import './Sidebar.css';

const Sidebar = ({ activePage, user, userRole, onPageChange, onLogout }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id || user?.userId) {
      fetchUnreadCount();
      // Poll for new notifications every 60 seconds
      const interval = setInterval(fetchUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount(user.id || user.userId);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const userInitials = user?.email
    ? user.email.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

  const handlePageChange = (page) => {
    onPageChange(page);
    setUserMenuOpen(false);
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    handlePageChange('profile');
  };

  const handleLogoutClick = (e) => {
    e.stopPropagation();
    setUserMenuOpen(false);
    onLogout();
  };

  const getRoleDisplay = () => {
    if (user?.role === 'ROLE_ADMIN') return 'Administrator';
    if (user?.role === 'ROLE_PREMIUM' || user?.subscriptionPlan === 'PREMIUM') return 'Premium Member 💎';
    return 'Free Plan';
  };

  return (
    <aside className="dash-sidebar">
      <div className="dash-logo">
        <span className="logo-mark">R</span>
        <span className="logo-name">Resume<strong>AI</strong></span>
      </div>

      <nav className="dash-nav">
        <button 
          className={`dash-nav-item ${activePage === 'resume' ? 'active' : ''}`} 
          onClick={() => handlePageChange('resume')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
          </svg>
          My Resumes
        </button>
        <button 
          className={`dash-nav-item ${activePage === 'templates' ? 'active' : ''}`} 
          onClick={() => handlePageChange('templates')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
          </svg>
          Templates
        </button>
        
        {user?.role === 'ROLE_PREMIUM' && (
          <button 
            className={`dash-nav-item ${activePage === 'ai-tools' ? 'active' : ''}`} 
            onClick={() => handlePageChange('ai-tools')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            AI Suite
          </button>
        )}

        <button 
          className={`dash-nav-item ${notifOpen ? 'active' : ''}`} 
          onClick={() => setNotifOpen(!notifOpen)}
        >
          <div className="notif-nav-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
          </div>
          Notifications
        </button>

        {user?.role === 'ROLE_ADMIN' && (
          <button 
            className={`dash-nav-item ${activePage === 'admin' ? 'active' : ''}`} 
            onClick={() => navigate('/admin')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Admin Panel
          </button>
        )}
      </nav>

      {user?.role === 'ROLE_FREE' && (
        <div className="sidebar-promo">
            <p>Go Premium for unlimited AI & Resumes</p>
            <button onClick={() => navigate('/pricing')}>Upgrade</button>
        </div>
      )}

      <div className="dash-user-block" onClick={toggleUserMenu}>
        <div className={`dash-avatar ${user?.role === 'ROLE_PREMIUM' || user?.subscriptionPlan === 'PREMIUM' ? 'premium' : ''}`}>
          {user?.profilePhoto ? (
            <img src={user.profilePhoto} alt="Avatar" className="sidebar-avatar-img" />
          ) : (
            userInitials
          )}
        </div>
        <div className="dash-user-info">
          <span className="dash-user-name">{user?.fullName || user?.email || 'Guest'}</span>
          <span className={`dash-user-role ${user?.role === 'ROLE_PREMIUM' ? 'premium' : ''}`}>{getRoleDisplay()}</span>
        </div>
        <svg 
          className={`dash-user-chevron ${userMenuOpen ? 'open' : ''}`} 
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        >
          <polyline points="6,9 12,15 18,9"/>
        </svg>

        <div className={`user-dropdown ${userMenuOpen ? 'open' : ''}`}>
          <button className="user-drop-item" onClick={handleProfileClick}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            View Profile
          </button>
          <div className="drop-divider"></div>
          <button className="user-drop-item danger" onClick={handleLogoutClick}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Log Out
          </button>
        </div>
      </div>

      {notifOpen && (
        <NotificationsCenter 
          user={user} 
          onClose={() => {
            setNotifOpen(false);
            fetchUnreadCount();
          }} 
        />
      )}
    </aside>
  );
};

export default Sidebar;
