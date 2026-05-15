import React from 'react';
import { useOutletContext } from 'react-router-dom';

const AuditLogs = () => {
  const { auditLogs } = useOutletContext();
  return (
    <div className="admin-logs">
      <div className="card">
        <h4>System Audit Logs</h4>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Admin</th>
              <th>Target</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs && auditLogs.map(log => (
              <tr key={log.id}>
                <td className="log-time">{new Date(log.timestamp).toLocaleString()}</td>
                <td><span className="log-action">{log.action}</span></td>
                <td>{log.performedBy}</td>
                <td>{log.targetUser || '-'}</td>
                <td className="log-details">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!auditLogs || auditLogs.length === 0) && <p className="empty-msg">No system logs available.</p>}
      </div>
    </div>
  );
};

export default AuditLogs;
