import React, { useState } from 'react';
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
          <div className="tpl-placeholder" style={{ background: `linear-gradient(135deg, var(--accent)11, var(--accent)22)` }}>
            <span>{template.name.charAt(0)}</span>
          </div>
        )}
        <div className="tpl-gradient"></div>

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
