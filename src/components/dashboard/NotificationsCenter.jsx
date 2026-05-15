import React, { useState, useEffect } from 'react';
import notificationService from '../../services/notificationService';
import './NotificationsCenter.css';

const NotificationsCenter = ({ user, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [user.id]);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications(user.id || user.userId);
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.notificationId === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead(user.id || user.userId);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <div className="notifications-overlay" onClick={onClose}>
      <div className="notifications-card" onClick={e => e.stopPropagation()}>
        <div className="notifications-header">
          <h3>Notifications</h3>
          <button className="mark-all-btn" onClick={handleMarkAllRead}>Mark all as read</button>
        </div>
        
        <div className="notifications-list">
          {loading ? (
            <div className="notif-loading">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="notif-empty">No notifications yet</div>
          ) : (
            notifications.map(notif => (
              <div 
                key={notif.notificationId} 
                className={`notif-item ${!notif.read ? 'unread' : ''}`}
                onClick={() => handleMarkAsRead(notif.notificationId)}
              >
                <div className="notif-icon">
                   {notif.type === 'BROADCAST' ? '📢' : '🔔'}
                </div>
                <div className="notif-content">
                  <div className="notif-title">{notif.title || 'System Message'}</div>
                  <div className="notif-message">{notif.message}</div>
                  <div className="notif-time">
                    {new Date(notif.sentAt).toLocaleDateString()} {new Date(notif.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {!notif.read && <div className="unread-dot"></div>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsCenter;
