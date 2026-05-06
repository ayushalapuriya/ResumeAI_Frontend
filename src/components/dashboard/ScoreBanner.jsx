import React from 'react';
import './ScoreBanner.css';

const ScoreBanner = ({ score, onBrowseTemplates }) => {
  return (
    <div className="score-banner">
      <div className="score-viz">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <circle className="score-track" cx="20" cy="20" r="18" />
          <circle 
            className="score-fill" 
            cx="20" cy="20" r="18" 
            style={{ strokeDashoffset: 113 - (113 * score) / 100 }}
          />
        </svg>
        <span className="score-number">{score}</span>
      </div>
      <div className="score-info">
        <h3>Resume Score</h3>
        <p>Your active resume is {score}% complete. Try adding more skills or experience to improve it.</p>
      </div>
      <button className="btn-banner-action" onClick={onBrowseTemplates}>
        Browse Templates
      </button>
    </div>
  );
};

export default ScoreBanner;
