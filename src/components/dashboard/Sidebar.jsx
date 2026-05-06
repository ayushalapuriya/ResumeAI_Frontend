import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ activePage, user, userRole, onPageChange, onLogout }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

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
          My Resume
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
        {user?.role === 'ROLE_ADMIN' && (
          <button 
            className={`dash-nav-item ${activePage === 'admin' ? 'active' : ''}`} 
            onClick={() => navigate('/admin')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Admin Center
          </button>
        )}
      </nav>

      <div className="dash-user-block" onClick={toggleUserMenu}>
        <div className="dash-avatar">{userInitials}</div>
        <div className="dash-user-info">
          <span className="dash-user-name">{user?.email || 'Guest'}</span>
          <span className="dash-user-role">{userRole}</span>
        </div>
        <svg 
          className={`dash-user-chevron ${userMenuOpen ? 'open' : ''}`} 
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        >
          <polyline points="6,9 12,15 18,9"/>
        </svg>

        <div className={`user-dropdown ${userMenuOpen ? 'open' : ''}`}>
          <button className="user-drop-item" onClick={handleProfileClick}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            View Profile
          </button>
          <div className="drop-divider"></div>
          <button className="user-drop-item danger" onClick={handleLogoutClick}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Log Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
