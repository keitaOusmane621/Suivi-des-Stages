import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './NotificationBell.css';

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Toutes les 30 secondes
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/messages/unread-count');
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Erreur fetching unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/messages/conversations');
      setNotifications(response.data);
    } catch (error) {
      console.error('Erreur fetching notifications:', error);
    }
  };

  const handleBellClick = () => {
    if (!showNotifications) {
      fetchNotifications();
    }
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="notification-bell">
      <button onClick={handleBellClick} className="bell-btn">
        🔔
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>
      
      {showNotifications && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h4>Messages</h4>
            <span className="unread-count">{unreadCount} non-lus</span>
          </div>
          
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <p className="no-notifications">Aucun message</p>
            ) : (
              notifications.map(conv => (
                <div key={conv._id} className="notification-item">
                  <div className="notification-content">
                    <strong>{conv.otherUser?.email}</strong>
                    <p>{conv.lastMessage?.subject}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="message-badge">{conv.unreadCount}</span>
                  )}
                </div>
              ))
            )}
          </div>
          
          <div className="notifications-footer">
            <a href="/messages">Voir tous les messages</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;