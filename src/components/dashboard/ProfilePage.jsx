import React, { useState, useRef } from 'react';
import authService from '../../services/authService';
import toast from 'react-hot-toast';
import './ProfilePage.css';

const ProfilePage = ({ user, userRole, resumeCount, score, onBack, onSaveProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profilePhoto: user?.profilePhoto || null
  });
  
  const fileInputRef = useRef(null);

  const userInitials = formData.fullName
    ? formData.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const downloadCount = 12; // Mock

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        toast.error('Photo size should be less than 1MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const tid = toast.loading('Updating profile...');
    try {
      await authService.updateProfile(user.userId || user.id, formData);
      toast.success('Profile updated successfully!', { id: tid });
      setIsEditing(false);
      if (onSaveProfile) onSaveProfile();
    } catch (err) {
      console.error('Update failed:', err);
      toast.error('Failed to update profile', { id: tid });
    } finally {
      setLoading(false);
    }
  };

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
          <div className="profile-photo-wrapper">
            {formData.profilePhoto ? (
              <img src={formData.profilePhoto} alt="Profile" className="profile-big-avatar img" />
            ) : (
              <div className="profile-big-avatar">{userInitials}</div>
            )}
            <button className="photo-edit-badge" onClick={() => fileInputRef.current.click()}>
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                 <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
               </svg>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoChange} 
              accept="image/*" 
              style={{ display: 'none' }} 
            />
          </div>
          
          <h3 className="profile-name">{formData.fullName || 'Guest User'}</h3>
          <p className="profile-role">{userRole}</p>
          <p className="profile-location">📍 Bangalore, India</p>
          
          <button className="btn-change-photo" onClick={() => fileInputRef.current.click()}>
            Change Photo
          </button>
          
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
          <div className="card-header-row">
            <h4 className="profile-section-head">Personal Details</h4>
            {!isEditing && (
              <button className="btn-edit-toggle" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>
          
          <div className="profile-fields">
            <div className="profile-field">
              <label>Full Name</label>
              {isEditing ? (
                <input 
                  name="fullName"
                  value={formData.fullName} 
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <div className="profile-field-val">{formData.fullName || '—'}</div>
              )}
            </div>
            <div className="profile-field">
              <label>Email Address</label>
              {isEditing ? (
                <input 
                  name="email"
                  type="email"
                  value={formData.email} 
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <div className="profile-field-val">{formData.email || '—'}</div>
              )}
            </div>
            <div className="profile-field">
              <label>Phone Number</label>
              {isEditing ? (
                <input 
                  name="phone"
                  value={formData.phone} 
                  onChange={handleChange}
                  className="profile-input"
                  placeholder="+91 12345 67890"
                />
              ) : (
                <div className="profile-field-val">{formData.phone || '—'}</div>
              )}
            </div>
            <div className="profile-field">
              <label>Job Title</label>
              <div className="profile-field-val">{userRole}</div>
            </div>
            <div className="profile-field">
              <label>Location</label>
              <div className="profile-field-val">Bangalore, India</div>
            </div>
          </div>
          
          {isEditing && (
            <div className="profile-actions">
              <button className="btn-cancel" onClick={() => setIsEditing(false)} disabled={loading}>
                Cancel
              </button>
              <button className="btn-save-profile" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
