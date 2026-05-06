import React from 'react';

const SectionNav = ({ sections, activeSection, selectedTemplate, templateId, accentColor, onSectionChange }) => {
  const getIcon = (icon) => {
    switch (icon) {
      case 'person':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        );
      case 'notes':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        );
      case 'work':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
          </svg>
        );
      case 'school':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        );
      case 'code':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/>
          </svg>
        );
      case 'bolt':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="section-nav-col">
      <p className="nav-col-label">Sections</p>

      <nav className="section-nav">
        {sections.map((s) => (
          <button
            key={s.id}
            className={`nav-item ${activeSection === s.id ? 'active' : ''}`}
            onClick={() => onSectionChange(s.id)}
            style={{ 
              borderLeftColor: activeSection === s.id ? accentColor : 'transparent',
              color: activeSection === s.id ? accentColor : undefined,
              background: activeSection === s.id ? `${accentColor}18` : undefined
            }}
          >
            <span className="nav-icon">{getIcon(s.icon)}</span>
            <span className="nav-label">{s.label}</span>
            <svg className="nav-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9,18 15,12 9,6"/>
            </svg>
          </button>
        ))}
      </nav>

      <div className="nav-col-footer">
        <div className="template-chip" style={{ borderColor: `${accentColor}44` }}>
          <span className="chip-dot" style={{ background: accentColor }}></span>
          <span>{selectedTemplate?.name || `Template ${templateId}`}</span>
        </div>
      </div>
    </aside>
  );
};

export default SectionNav;
