import React, { useState } from 'react';

const SkillsForm = ({ skills, accentColor, onAddSkill, onRemoveSkill }) => {
  const [newSkill, setNewSkill] = useState('');

  const handleAdd = () => {
    if (newSkill.trim()) {
      onAddSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  const handleKeydown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="form-section">
      <div className="sec-header">
        <div className="sec-header-icon" style={{ background: `${accentColor}18`, color: accentColor }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
          </svg>
        </div>
        <div>
          <h2 className="sec-title">Skills</h2>
          <p className="sec-sub">Press Enter or click Add after each skill</p>
        </div>
      </div>

      <div className="skill-input-row">
        <input 
          type="text" 
          className="skill-input" 
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeydown}
          placeholder="e.g. JavaScript, Docker, Project Management…" 
        />
        <button 
          className="btn-add-skill" 
          style={{ background: accentColor }} 
          onClick={handleAdd}
        >
          Add
        </button>
      </div>

      <div className="skills-cloud">
        {skills.map((skill, index) => (
          <div 
            key={index}
            className="skill-chip"
            style={{ 
              background: `${accentColor}12`,
              borderColor: `${accentColor}35`,
              color: accentColor
            }}
          >
            {skill}
            <button className="chip-remove" onClick={() => onRemoveSkill(skill)} aria-label="Remove skill">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <p className="skills-tip">
          No skills added yet — type one above and press Enter.
        </p>
      )}
    </div>
  );
};

export default SkillsForm;
