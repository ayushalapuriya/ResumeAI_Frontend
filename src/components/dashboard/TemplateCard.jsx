import React, { useState } from 'react';
import UniversalTemplate from '../../pages/ResumeBuilder/utils/UniversalTemplate';
import { DEFAULT_RESUME_DATA } from '../../pages/ResumeBuilder/utils/resumeDefaults';
import './TemplateCard.css';

const TemplateCard = ({ template, isNew, onUse, onPreview }) => {
  const [hovered, setHovered] = useState(false);

  const formatUses = (count) => {
    if (!count) return '0';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
    return count.toString();
  };

  return (
    <div 
      className="tpl-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div 
        className="tpl-preview"
        style={{ backgroundImage: template.thumbnailUrl ? `url(${template.thumbnailUrl})` : 'none' }}
      >
        {!template.thumbnailUrl && (
          <div className="tpl-placeholder">
            <div className="tpl-mini-preview-scaler">
               <UniversalTemplate 
                  data={DEFAULT_RESUME_DATA} 
                  template={template} 
                  accentColor="#6366f1" 
                />
            </div>
          </div>
        )}

        <div className={`tpl-overlay ${hovered ? 'visible' : ''}`}>
          <button className="tpl-btn-use" onClick={() => onUse(template)}>
            Use Template →
          </button>
          <button className="tpl-btn-preview" onClick={(e) => {
            e.stopPropagation();
            onPreview(template);
          }}>
            Quick Preview
          </button>
        </div>

        {isNew && <span className="tpl-new-badge">NEW</span>}
        {template.isPremium && (
          <div className="tpl-premium-tag">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/></svg>
            <span>PREMIUM</span>
          </div>
        )}
        {template.isPremium && (
          <div className="tpl-lock-indicator">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
        )}
      </div>

      <div className="tpl-info-row">
        <div>
          <p className="tpl-name">{template.name}</p>
          <p className="tpl-cat">{template.category}</p>
        </div>
        <span className="tpl-uses">{formatUses(template.usageCount)} uses</span>
      </div>
    </div>
  );
};

export default TemplateCard;
