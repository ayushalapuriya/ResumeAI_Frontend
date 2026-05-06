import React from 'react';
import './ProfilePage.css';

const ProfilePage = ({ user, userRole, resumeCount, score, onBack, onSaveProfile }) => {
  const userInitials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const downloadCount = 12; // Mock

  return (
    <div className="dash-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-sub">Manage your personal information</p>
        </div>
        <button className="btn-back-link" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
          Back
        </button>
      </div>

      <div className="profile-layout">
        {/* Avatar Card */}
        <div className="profile-avatar-card">
          <div className="profile-big-avatar">{userInitials}</div>
          <h3 className="profile-name">{user?.fullName || 'Guest User'}</h3>
          <p className="profile-role">{userRole}</p>
          <p className="profile-location">📍 Bangalore, India</p>
          <button className="btn-change-photo">Change Photo</button>
          <div className="profile-stats">
            <div className="pstat">
              <span className="pstat-val">{resumeCount}</span>
              <span className="pstat-label">Resumes</span>
            </div>
            <div className="pstat-div"></div>
            <div className="pstat">
              <span className="pstat-val">{downloadCount}</span>
              <span className="pstat-label">Downloads</span>
            </div>
            <div className="pstat-div"></div>
            <div className="pstat">
              <span className="pstat-val">{score}</span>
              <span className="pstat-label">Score</span>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="profile-details-card">
          <h4 className="profile-section-head">Personal Details</h4>
          <div className="profile-fields">
            <div className="profile-field">
              <label>Full Name</label>
              <div className="profile-field-val">{user?.fullName || '—'}</div>
            </div>
            <div className="profile-field">
              <label>Email Address</label>
              <div className="profile-field-val">{user?.email || '—'}</div>
            </div>
            <div className="profile-field">
              <label>Job Title</label>
              <div className="profile-field-val">{userRole}</div>
            </div>
            <div className="profile-field">
              <label>Location</label>
              <div className="profile-field-val">Bangalore, India</div>
            </div>
            <div className="profile-field">
              <label>Member Since</label>
              <div className="profile-field-val">March 2024</div>
            </div>
          </div>
          <button className="btn-save-profile" onClick={onSaveProfile}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
