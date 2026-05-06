import React from 'react';
import './TemplatePreviewModal.css';

const TemplatePreviewModal = ({ open, template, accent, onClose, onUse }) => {
  if (!open) return null;

  const onOverlayClick = () => {
    onClose();
  };

  const onModalClick = (e) => {
    e.stopPropagation();
  };

  const hasImage = !!template?.thumbnailUrl;

  return (
    <div className={`modal-overlay ${open ? 'show' : ''}`} onClick={onOverlayClick}>
      <div className="preview-modal" onClick={onModalClick}>
        {/* Header */}
        <div className="preview-modal-header">
          <div className="preview-modal-title-row">
            <div className="preview-modal-icon" style={{ background: `${accent}18`, color: accent }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
            </div>
            <div>
              <span className="preview-modal-title">{template?.name}</span>
              <span className="preview-modal-cat">{template?.category}</span>
            </div>
          </div>
          <button className="preview-modal-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="preview-modal-body">
          {template && (
            <>
              {hasImage ? (
                <div className="preview-image-wrap">
                  <img
                    src={template.thumbnailUrl}
                    alt={`${template.name} preview`}
                    className="preview-image"
                  />
                </div>
              ) : (
                <div className="preview-live-wrap">
                  <div className="preview-live-scaler">
                    <div className="preview-live-placeholder" style={{ color: accent }}>
                      Live Preview coming soon
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="preview-modal-footer">
          <div className="preview-footer-meta">
            {template && (
              <>
                <span className="preview-meta-uses">{template.usageCount?.toLocaleString()} uses</span>
                {template.isPremium && (
                  <span className="preview-meta-badge premium">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    PRO
                  </span>
                )}
              </>
            )}
          </div>
          <button 
            className="btn-use-tpl" 
            style={{ background: accent }} 
            onClick={() => template && onUse(template)}
          >
            Use This Template
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12,5 19,12 12,19"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewModal;
