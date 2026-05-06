import React from 'react';

const PersonalInfoForm = ({ resume, accentColor, onUpdate }) => {
  const handleChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="form-section">
      <div className="sec-header">
        <div className="sec-header-icon" style={{ background: `${accentColor}18`, color: accentColor }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div>
          <h2 className="sec-title">Personal Information</h2>
          <p className="sec-sub">Appears at the top of your resume</p>
        </div>
      </div>

      <div className="field-grid">
        <div className="field">
          <label>Full Name <span className="req">*</span></label>
          <input 
            type="text" 
            value={resume.fullName || ''} 
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Alex Johnson" 
          />
        </div>

        <div className="field">
          <label>Job Title</label>
          <input 
            type="text" 
            value={resume.jobTitle || ''} 
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            placeholder="Product Designer" 
          />
        </div>

        <div className="field">
          <label>Email Address</label>
          <input 
            type="email" 
            value={resume.email || ''} 
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="you@email.com" 
          />
        </div>

        <div className="field">
          <label>Phone Number</label>
          <input 
            type="text" 
            value={resume.phone || ''} 
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="999-999-9999" 
          />
        </div>

        <div className="field">
          <label>Location</label>
          <input 
            type="text" 
            value={resume.location || ''} 
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="City, State / Country" 
          />
        </div>

        <div className="field">
          <label>Website</label>
          <input 
            type="text" 
            value={resume.website || ''} 
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="yoursite.com" 
          />
        </div>

        <div className="field">
          <label>LinkedIn</label>
          <input 
            type="text" 
            value={resume.linkedin || ''} 
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="linkedin.com/in/yourname" 
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
