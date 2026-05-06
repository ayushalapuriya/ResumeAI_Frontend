import React from 'react';
import ResumeCard from './ResumeCard';
import ScoreBanner from './ScoreBanner';
import './ResumeList.css';

const ResumeList = ({ 
  resumes, 
  activeSkills, 
  score, 
  onCreateNew, 
  onEditResume, 
  onDownloadResume, 
  onDuplicateResume, 
  onDeleteResume,
  onBrowseTemplates
}) => {
  return (
    <div className="dash-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Resumes</h1>
          <p className="page-sub">Manage and edit your resume documents</p>
        </div>
        <button className="btn-new" onClick={onCreateNew}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Resume
        </button>
      </div>

      <ScoreBanner score={score} onBrowseTemplates={onBrowseTemplates} />

      <div className="resume-cards-grid">
        {resumes.map((r) => (
          <ResumeCard
            key={r.resumeId}
            resume={r}
            onEdit={onEditResume}
            onDownload={onDownloadResume}
            onDuplicate={onDuplicateResume}
            onDelete={onDeleteResume}
          />
        ))}

        <button className="resume-card-new" onClick={onCreateNew}>
          <div className="new-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
          <p className="new-card-label">Create New Resume</p>
          <p className="new-card-sub">Start from scratch or a template</p>
        </button>
      </div>

      <div className="skills-snapshot">
        <h3 className="snapshot-title">Skills on Active Resume</h3>
        <div className="snapshot-chips">
          {activeSkills.map((sk, i) => (
            <span
              key={i}
              className="snap-chip"
              style={{ background: sk.bg, color: sk.color, borderColor: sk.border }}
            >
              {sk.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumeList;
