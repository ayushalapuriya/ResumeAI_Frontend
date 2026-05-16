import React from 'react';
import './ResumeCard.css';

const ResumeCard = ({ resume, onEdit, onDownload, onDuplicate, onDelete }) => {
  return (
    <div className={`resume-card ${resume.active ? 'active-resume' : ''}`}>
      <div className="resume-card-bar" style={{ background: resume.color }}></div>

      <div className="resume-card-preview">
        <div className="rmock-header" style={{ background: resume.color }}>
          <div className="rmock-name-line"></div>
          <div className="rmock-title-line"></div>
        </div>
        <div className="rmock-body">
          {[1, 2, 3].map((s) => (
            <div className="rmock-section" key={s}>
              <div className="rmock-sec-head" style={{ background: `${resume.color}55` }}></div>
              <div className="rmock-line wide"></div>
              <div className="rmock-line mid"></div>
              <div className="rmock-line short"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="resume-card-info">
        <div className="resume-card-meta">
          <div>
            <p className="resume-card-name">{resume.name}</p>
            <p className="resume-card-date">Updated {resume.updated}</p>
          </div>
          {resume.active && <span className="resume-active-badge">Active</span>}
        </div>
        <div className="resume-card-actions">
          <button 
            className="btn-edit" 
            style={{ background: resume.color }} 
            onClick={() => onEdit(resume)}
          >
            Edit
          </button>

          <button className="btn-icon-action" title="Download" onClick={() => onDownload(resume)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>

          <button className="btn-icon-action" title="Duplicate" onClick={() => onDuplicate(resume)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </button>

          <button className="btn-icon-action danger" title="Delete" onClick={() => onDelete(resume)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6"/>
              <path d="M19,6l-1,14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5,6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;
