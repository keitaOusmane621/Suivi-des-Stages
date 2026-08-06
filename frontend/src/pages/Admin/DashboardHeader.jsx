import React from 'react';
import { Link } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import ThemeToggle from '../../components/common/ThemeToggle'; // ou créez ce fichier

const DashboardHeader = ({ user, unreadMessages, onLogout, onToggleTheme, isDarkMode }) => (
  <header className="dashboard-header">
    <div className="header-left">
      <div className="logo">
        <span className="logo-icon">🎓</span>
        <span className="logo-text">StageTrack Admin</span>
      </div>
    </div>
    <div className="header-center">
      <h1>Tableau de Bord</h1>
    </div>
    <div className="header-right">
      <div className="user-info">
        <span className="user-avatar">👤</span>
        <span className="user-email">{user?.email}</span>
      </div>
      <div className="header-actions">
        <NotificationBell count={unreadMessages} />
        <ThemeToggle isDark={isDarkMode} onToggle={onToggleTheme} />
        <Link to="/" className="home-btn">🏠 Accueil</Link>
        <button onClick={onLogout} className="logout-btn">🚪 Déconnexion</button>
      </div>
    </div>
  </header>
);

export default DashboardHeader;