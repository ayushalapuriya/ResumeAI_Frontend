import React from 'react';

const EducationForm = ({ items, accentColor, onAddItem, onRemoveItem, onUpdateItem }) => {
  const handleChange = (id, field, value) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    onUpdateItem({ education: updatedItems });
  };

  return (
    <div className="form-section">
      <div className="sec-header">
        <div className="sec-header-icon" style={{ background: `${accentColor}18`, color: accentColor }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
        <div>
          <h2 className="sec-title">Education</h2>
          <p className="sec-sub">Your academic background</p>
        </div>
      </div>

      {items.map((edu, i) => (
        <div className="entry-card" key={edu.id}>
          <div className="entry-card-header">
            <div className="entry-card-index" style={{ background: `${accentColor}18`, color: accentColor }}>{i + 1}</div>
            <span className="entry-card-label">{edu.institution || 'New Education'}</span>
            <button className="btn-remove" onClick={() => onRemoveItem(edu.id)} aria-label="Remove education">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div className="field-grid">
            <div className="field">
              <label>Institution</label>
              <input 
                type="text" 
                value={edu.institution || ''} 
                onChange={(e) => handleChange(edu.id, 'institution', e.target.value)}
                placeholder="University Name" 
              />
            </div>
            <div className="field">
              <label>Degree</label>
              <input 
                type="text" 
                value={edu.degree || ''} 
                onChange={(e) => handleChange(edu.id, 'degree', e.target.value)}
                placeholder="B.Sc. / B.E." 
              />
            </div>
            <div className="field">
              <label>Field of Study</label>
              <input 
                type="text" 
                value={edu.field || ''} 
                onChange={(e) => handleChange(edu.id, 'field', e.target.value)}
                placeholder="Computer Science" 
              />
            </div>
            <div className="field">
              <label>Graduation Year</label>
              <input 
                type="text" 
                value={edu.year || ''} 
                onChange={(e) => handleChange(edu.id, 'year', e.target.value)}
                placeholder="2024" 
              />
            </div>
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
        Add Education
      </button>
    </div>
  );
};

export default EducationForm;
