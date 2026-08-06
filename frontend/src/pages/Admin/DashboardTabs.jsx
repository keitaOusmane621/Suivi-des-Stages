import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardTabs = ({ selectedTab, onTabChange, unreadMessages, usersCount, offersCount }) => {
  const navigate = useNavigate();
  return (
    <nav className="dashboard-nav">
      <div className="nav-tabs">
        <button
          className={`nav-tab ${selectedTab === 'stats' ? 'active' : ''}`}
          onClick={() => onTabChange('stats')}
        >
          <span className="tab-icon">📊</span> Statistiques
        </button>
        <button
          className={`nav-tab ${selectedTab === 'users' ? 'active' : ''}`}
          onClick={() => onTabChange('users')}
        >
          <span className="tab-icon">👥</span> Utilisateurs
          <span className="tab-badge">{usersCount}</span>
        </button>
        <button
          className={`nav-tab ${selectedTab === 'offers' ? 'active' : ''}`}
          onClick={() => onTabChange('offers')}
        >
          <span className="tab-icon">💼</span> Offres
          <span className="tab-badge">{offersCount}</span>
        </button>
        <button
          className={`nav-tab ${selectedTab === 'messages' ? 'active' : ''}`}
          onClick={() => navigate('/messaging')}
        >
          <span className="tab-icon">💬</span> Messages
          {unreadMessages > 0 && (
            <span className="tab-badge notification">{unreadMessages}</span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default DashboardTabs;