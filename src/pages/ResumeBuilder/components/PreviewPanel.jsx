import React from 'react';

const PreviewPanel = ({ previewHtml, onExportPdf }) => {
  return (
    <div className="preview-panel">
      {/* Panel top bar */}
      <div className="preview-topbar">
        <div className="preview-label-row">
          <span className="preview-dot live"></span>
          <span className="preview-label">Live Preview</span>
        </div>

        <div className="preview-topbar-actions">
          <button className="btn-preview-action" onClick={onExportPdf}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            PDF
          </button>
        </div>
      </div>

      {/* Resume paper */}
      <div className="preview-sheet-wrap">
        <div className="preview-paper">
          <div 
            className="preview-paper-inner" 
            dangerouslySetInnerHTML={{ __html: previewHtml }} 
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
