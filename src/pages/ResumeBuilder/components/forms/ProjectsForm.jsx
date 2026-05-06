import React from 'react';

const ProjectsForm = ({ items, accentColor, onAddItem, onRemoveItem, onUpdateItem }) => {
  const handleChange = (id, field, value) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    onUpdateItem({ projects: updatedItems });
  };

  return (
    <div className="form-section">
      <div className="sec-header">
        <div className="sec-header-icon" style={{ background: `${accentColor}18`, color: accentColor }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/>
          </svg>
        </div>
        <div>
          <h2 className="sec-title">Projects</h2>
          <p className="sec-sub">Side projects, open source, or notable work</p>
        </div>
      </div>

      {items.map((proj, i) => (
        <div className="entry-card" key={proj.id}>
          <div className="entry-card-header">
            <div className="entry-card-index" style={{ background: `${accentColor}18`, color: accentColor }}>{i + 1}</div>
            <span className="entry-card-label">{proj.name || 'New Project'}</span>
            <button className="btn-remove" onClick={() => onRemoveItem(proj.id)} aria-label="Remove project">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div className="field-grid">
            <div className="field">
              <label>Project Name</label>
              <input 
                type="text" 
                value={proj.name || ''} 
                onChange={(e) => handleChange(proj.id, 'name', e.target.value)}
                placeholder="DesignOS" 
              />
            </div>
            <div className="field">
              <label>Your Role</label>
              <input 
                type="text" 
                value={proj.role || ''} 
                onChange={(e) => handleChange(proj.id, 'role', e.target.value)}
                placeholder="Lead Developer" 
              />
            </div>
            <div className="field">
              <label>Start Date</label>
              <input 
                type="text" 
                value={proj.startDate || ''} 
                onChange={(e) => handleChange(proj.id, 'startDate', e.target.value)}
                placeholder="2023" 
              />
            </div>
            <div className="field">
              <label>End Date</label>
              <input 
                type="text" 
                value={proj.endDate || ''} 
                onChange={(e) => handleChange(proj.id, 'endDate', e.target.value)}
                placeholder="2024 / Present" 
              />
            </div>
            <div className="field full-width">
              <label>URL / GitHub</label>
              <input 
                type="text" 
                value={proj.url || ''} 
                onChange={(e) => handleChange(proj.id, 'url', e.target.value)}
                placeholder="github.com/you/project" 
              />
            </div>
          </div>

          <div className="field full-width">
            <label>Description</label>
            <textarea 
              value={proj.description || ''} 
              onChange={(e) => handleChange(proj.id, 'description', e.target.value)}
              rows="3"
              placeholder="What did you build? What technologies? What impact?"
            />
          </div>
        </div>
      ))}

      <button 
        className="btn-add-entry" 
        onClick={onAddItem}
        style={{ color: accentColor, borderColor: `${accentColor}44` }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add Project
      </button>
    </div>
  );
};

export default ProjectsForm;
