import React from 'react';

const BuilderTopbar = ({ 
  accentColor, 
  saveStatus, 
  isLoading, 
  resume, 
  onBack, 
  onExportPdf, 
  onSave,
  onPatch
}) => {
  const saveLabel = {
    idle: 'Save Changes',
    saving: 'Saving...',
    saved: 'Saved!',
    error: 'Error Saving'
  }[saveStatus];

  return (
    <header className="builder-topbar">
      {/* Back to Dashboard */}
      <button className="topbar-back" onClick={onBack}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15,18 9,12 15,6"/>
        </svg>
        Dashboard
      </button>

      {/* Logo + document name */}
      <div className="topbar-center">
        <div className="topbar-logo">
          <span className="logo-mark" style={{ background: accentColor }}>R</span>
          <span className="logo-text">Resume<strong>AI</strong></span>
        </div>
        <span className="topbar-divider"></span>
        <span className="topbar-doc-name">
          {isLoading ? (
            <span className="loading-indicator">Loading…</span>
          ) : (
            <span>{resume?.fullName || 'Untitled Resume'}</span>
          )}
        </span>
      </div>

      {/* AI Toolbar + Actions */}
      <div className="topbar-actions">
        {/* Placeholder for AI Toolbar */}
        <div className="ai-toolbar-wrap" style={{ opacity: 0.5, fontSize: '0.75rem', fontWeight: 700 }}>
          AI TOOLS (Coming Soon)
        </div>

        <div className="topbar-divider"></div>

        {/* Save */}
        <button
          className={`btn-topbar-primary btn-${saveStatus}`}
          style={{ 
            background: (saveStatus === 'idle' || saveStatus === 'saving') ? accentColor : (saveStatus === 'saved' ? '#22c55e' : (saveStatus === 'error' ? '#ef4444' : accentColor)) 
          }}
          disabled={saveStatus === 'saving' || isLoading}
          onClick={onSave}
        >
          {saveStatus === 'saving' ? (
            <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2a10 10 0 1 0 10 10"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17,21 17,13 7,13"/><polyline points="7,3 7,8 15,8"/>
            </svg>
          )}
          <span style={{ marginLeft: '6px' }}>{saveLabel}</span>
        </button>
      </div>
    </header>
  );
};

export default BuilderTopbar;
