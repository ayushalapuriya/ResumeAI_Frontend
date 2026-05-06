import React from 'react';

const ExperienceForm = ({ items, accentColor, onAddItem, onRemoveItem, onUpdateItem }) => {
  const handleChange = (id, field, value) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    onUpdateItem({ experience: updatedItems });
  };

  return (
    <div className="form-section">
      <div className="sec-header">
        <div className="sec-header-icon" style={{ background: `${accentColor}18`, color: accentColor }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
          </svg>
        </div>
        <div>
          <h2 className="sec-title">Work Experience</h2>
          <p className="sec-sub">Most recent roles first</p>
        </div>
      </div>

      {items.map((exp, i) => (
        <div className="entry-card" key={exp.id}>
          <div className="entry-card-header">
            <div className="entry-card-index" style={{ background: `${accentColor}18`, color: accentColor }}>{i + 1}</div>
            <span className="entry-card-label">{exp.role || 'New Position'}</span>
            <button className="btn-remove" onClick={() => onRemoveItem(exp.id)} aria-label="Remove experience">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div className="field-grid">
            <div className="field">
              <label>Company</label>
              <input 
                type="text" 
                value={exp.company || ''} 
                onChange={(e) => handleChange(exp.id, 'company', e.target.value)}
                placeholder="Acme Corp" 
              />
            </div>
            <div className="field">
              <label>Job Title</label>
              <input 
                type="text" 
                value={exp.role || ''} 
                onChange={(e) => handleChange(exp.id, 'role', e.target.value)}
                placeholder="Senior Designer" 
              />
            </div>
            <div className="field">
              <label>Start Date</label>
              <input 
                type="text" 
                value={exp.startDate || ''} 
                onChange={(e) => handleChange(exp.id, 'startDate', e.target.value)}
                placeholder="Jan 2022" 
              />
            </div>
            <div className="field">
              <label>End Date</label>
              <input 
                type="text" 
                value={exp.endDate || ''} 
                onChange={(e) => handleChange(exp.id, 'endDate', e.target.value)}
                disabled={exp.current} 
                placeholder="Dec 2023" 
              />
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={exp.current || false} 
                  onChange={(e) => handleChange(exp.id, 'current', e.target.checked)}
                /> Currently working here
              </label>
            </div>
          </div>

          <div className="field full-width">
            <label>Description</label>
            <textarea 
              value={exp.description || ''} 
              onChange={(e) => handleChange(exp.id, 'description', e.target.value)}
              rows="3"
              placeholder="Describe your responsibilities and key achievements…"
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
        Add Experience
      </button>
    </div>
  );
};

export default ExperienceForm;
