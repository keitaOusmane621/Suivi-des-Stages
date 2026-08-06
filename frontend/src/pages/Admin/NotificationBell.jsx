import React from 'react';
import { Link } from 'react-router-dom';

const NotificationBell = ({ count }) => (
  <Link to="/messaging" className={`notification-btn ${count > 0 ? 'has-new' : ''}`}>
    <span className="notification-icon">🔔</span>
    {count > 0 && <span className="notification-badge">{count > 9 ? '9+' : count}</span>}
  </Link>
);

export default NotificationBell;