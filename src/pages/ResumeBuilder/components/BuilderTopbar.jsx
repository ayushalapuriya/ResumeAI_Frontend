import React from 'react';

const BuilderTopbar = ({ 
  resumeTitle, 
  saveStatus, 
  onBack, 
  onSave,
  onExportPdf,
  resumeId
}) => {
  const saveLabel = {
    idle: 'Save',
    saving: 'Saving...',
    saved: 'Saved',
    error: 'Error'
  }[saveStatus];

  return (
    <header className="builder-topbar">
      <div className="topbar-left">
        <button className="topbar-back" onClick={onBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
          Back
        </button>
      </div>

      <div className="topbar-center">
        <div className="topbar-logo">
          <span className="logo-mark">R</span>
          <span className="logo-text">Resume<strong>AI</strong></span>
        </div>
        <div className="topbar-divider"></div>
        <div className="topbar-doc-info">
          <span className="topbar-doc-name">{resumeTitle}</span>
        </div>
      </div>

      <div className="topbar-actions">
        <div className="save-indicator">
          {saveStatus === 'saving' && <span className="saving-dot"></span>}
          <span className={`status-text ${saveStatus}`}>{saveLabel}</span>
        </div>
        
        <button className="btn-topbar-secondary" onClick={onExportPdf}>
          Export
        </button>
        
        <button
          className={`btn-topbar-primary status-${saveStatus}`}
          disabled={saveStatus === 'saving'}
          onClick={onSave}
        >
          {saveStatus === 'saving' ? 'Processing...' : 'Save Changes'}
        </button>
      </div>
    </header>
  );
};

export default BuilderTopbar;
