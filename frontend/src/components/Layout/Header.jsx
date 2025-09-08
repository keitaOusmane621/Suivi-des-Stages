import React from 'react';
import NotificationBell from '../Common/NotificationBell';
import './Header.css';

const Header = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <header className="header">
      <div className="header-left">
        <h1>StageTrack</h1>
      </div>
      
      <div className="header-right">
        <NotificationBell />
        
        <div className="user-menu">
          <span className="user-email">{user?.email}</span>
          <span className="user-role">({user?.role})</span>
        </div>
      </div>
    </header>
  );
};

export default Header;