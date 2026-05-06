import React from 'react';

const SummaryForm = ({ resume, accentColor, onUpdate }) => {
  const handleChange = (value) => {
    onUpdate({ summary: value });
  };

  const WARN_AT_LENGTH = 400;
  const MAX_SUMMARY_LENGTH = 600;

  return (
    <div className="form-section">
      <div className="sec-header">
        <div className="sec-header-icon" style={{ background: `${accentColor}18`, color: accentColor }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/>
          </svg>
        </div>
        <div>
          <h2 className="sec-title">Professional Summary</h2>
          <p className="sec-sub">2–3 sentences that define your brand</p>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '7px', flexShrink: 0 }}>
          <button className="btn-ai" disabled style={{ opacity: 0.5 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.93V15a1 1 0 0 0-2 0v1.93A7 7 0 0 1 5 10h1a1 1 0 0 0 0-2H5a7 7 0 0 1 6-6.93V3a1 1 0 0 0 2 0v-.93A7 7 0 0 1 19 10h-1a1 1 0 0 0 0 2h1a7 7 0 0 1-6 6.93z"/>
            </svg>
            Generate
          </button>
        </div>
      </div>

      <div className="field full-width">
        <label>Summary</label>
        <textarea 
          value={resume.summary || ''} 
          onChange={(e) => handleChange(e.target.value)}
          rows="6"
          placeholder="Experienced professional with a track record of…"
        />
        <div className="field-meta">
          <span className={`char-count ${(resume.summary?.length || 0) > WARN_AT_LENGTH ? 'warn' : ''}`}>
            {(resume.summary?.length || 0)} / {MAX_SUMMARY_LENGTH}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SummaryForm;
