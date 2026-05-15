import React from 'react';
import { useOutletContext } from 'react-router-dom';

const Overview = () => {
  const { stats, auditLogs } = useOutletContext();
  return (
    <div className="admin-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-value">{stats?.totalUsers || 0}</p>
          <span className="stat-label">Active: {stats?.activeUsers || 0}</span>
        </div>
        <div className="stat-card">
          <h3>Total Resumes</h3>
          <p className="stat-value">{stats?.totalResumes || 0}</p>
          <span className="stat-label">Created this week</span>
        </div>
        <div className="stat-card">
          <h3>Templates</h3>
          <p className="stat-value">{stats?.totalTemplates || 0}</p>
          <span className="stat-label">Active designs</span>
        </div>
        <div className="stat-card highlight">
          <h3>AI Usage</h3>
          <p className="stat-value">1.2M</p>
          <span className="stat-label">Tokens consumed</span>
        </div>
      </div>
      
      <div className="activity-section">
        <div className="card">
          <h4>Recent Activity</h4>
          <div className="activity-list">
            {auditLogs && auditLogs.slice(0, 6).map(log => (
              <div key={log.id} className="activity-item">
                <div className="activity-icon">
                  {log.action.includes('USER') ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  ) : log.action.includes('TEMPLATE') ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  )}
                </div>
                <div className="activity-info">
                  <p className="activity-text">
                    <strong>{log.performedBy}</strong> {log.action.toLowerCase().replace('_', ' ')} 
                    {log.targetUser && <> for <strong>{log.targetUser}</strong></>}
                  </p>
                  <span className="activity-time">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
            {(!auditLogs || auditLogs.length === 0) && <p className="empty-msg">No recent activity found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
