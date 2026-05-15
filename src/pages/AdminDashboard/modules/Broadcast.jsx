import React, { useState } from 'react';
import adminService from '../../../services/adminService';
import toast from 'react-hot-toast';

const Broadcast = () => {
  const [broadcastMsg, setBroadcastMsg] = useState('');

  const handleBroadcast = async () => {
    if (!broadcastMsg.trim()) return;
    try {
      await adminService.sendBroadcast({ message: broadcastMsg });
      toast.success('Broadcast sent to all users');
      setBroadcastMsg('');
    } catch (error) {
      toast.error('Failed to send broadcast');
    }
  };

  return (
    <div className="admin-notifications">
      <div className="notification-manager">
        <div className="card broadcast-card">
          <h4>System Broadcast</h4>
          <p className="subtitle">Send a notification to all active users</p>
          <textarea 
            placeholder="Type your message here..." 
            value={broadcastMsg}
            onChange={(e) => setBroadcastMsg(e.target.value)}
            style={{ width: '100%', minHeight: '150px', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', margin: '16px 0' }}
          />
          <button className="btn-primary" onClick={handleBroadcast}>Send Broadcast</button>
        </div>
      </div>
    </div>
  );
};

export default Broadcast;
