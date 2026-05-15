import React from 'react';

const PreviewPanel = ({ TemplateComponent, resumeData, accentColor, onExportPdf }) => {
  return (
    <div className="preview-panel">
      {/* Panel top bar */}
      <div className="preview-topbar">
        <div className="preview-label-row">
          <span className="preview-dot live"></span>
          <span className="preview-label">Live Preview</span>
        </div>

        <div className="preview-topbar-actions">
          <div className="zoom-controls">
            <span className="zoom-value">100%</span>
          </div>
          <button className="btn-preview-action" onClick={onExportPdf}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      {/* Resume paper container */}
      <div className="preview-sheet-wrap">
        <div className="preview-paper">
          <div className="preview-paper-inner">
            {TemplateComponent ? (
              <TemplateComponent data={resumeData} accentColor={accentColor} />
            ) : (
              <div className="preview-error">Select a template to preview</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="preview-footer-info">
        <span>A4 Standard</span>
        <span>·</span>
        <span>Auto-saving</span>
      </div>
    </div>
  );
};

export default PreviewPanel;
