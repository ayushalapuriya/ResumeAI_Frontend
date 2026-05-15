import React from 'react';

const SectionNav = ({ sections, activeSection, selectedTemplate, templateId, accentColor, onSectionChange, onToggleVisibility, onMoveSection }) => {
  const getIcon = (icon) => {
    switch (icon) {
      case 'person':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
      case 'notes':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
      case 'work':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
      case 'school':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
      case 'code':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/></svg>;
      case 'bolt':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></svg>;
      default:
        return null;
    }
  };

  return (
    <aside className="section-nav-col">
      <div className="nav-header-block">
        <p className="nav-col-label">Structure</p>
      </div>

      <nav className="section-nav">
        {sections.map((s, index) => (
          <div key={s.id} className={`nav-item-wrapper ${activeSection === s.id ? 'active' : ''} ${s.hidden ? 'hidden' : ''}`}>
            <button
              className="nav-item-main"
              onClick={() => onSectionChange(s.id)}
            >
              <span className="nav-icon">{getIcon(s.icon)}</span>
              <span className="nav-label">{s.label}</span>
            </button>
            
            <div className="nav-item-controls">
              <button 
                className="control-btn" 
                onClick={(e) => { e.stopPropagation(); onToggleVisibility(s.id); }}
                title={s.hidden ? "Show section" : "Hide section"}
              >
                {s.hidden ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
              <div className="move-controls">
                <button disabled={index === 0} onClick={() => onMoveSection(index, 'up')}>▲</button>
                <button disabled={index === sections.length - 1} onClick={() => onMoveSection(index, 'down')}>▼</button>
              </div>
            </div>
          </div>
        ))}
      </nav>

      <div className="nav-col-footer">
        <p className="nav-col-label">Selected Style</p>
        <div className="template-card-mini" style={{ borderLeft: `4px solid ${accentColor}` }}>
          <div className="template-info">
            <span className="t-name">{selectedTemplate?.name || `Template ${templateId}`}</span>
            <span className="t-status">Professional A4</span>
          </div>
          <div className="accent-preview" style={{ background: accentColor }}></div>
        </div>
      </div>
    </aside>
  );
};

export default SectionNav;
