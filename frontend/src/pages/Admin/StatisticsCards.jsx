import React from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ icon, label, value, trend, link, linkLabel, highlight }) => (
  <div className={`stat-card ${highlight ? 'highlight' : ''}`}>
    <div className="stat-card-header">
      <span className="stat-icon">{icon}</span>
      <h3>{label}</h3>
    </div>
    <div className="stat-card-body">
      <span className="stat-value">{value}</span>
      {trend && <span className="stat-trend positive">{trend}</span>}
    </div>
    {link && (
      <div className="stat-card-footer">
        <Link to={link} className="stat-link">{linkLabel}</Link>
      </div>
    )}
  </div>
);

const StatisticsCards = ({ stats, unreadMessages }) => (
  <div className="stats-grid">
    <StatCard icon="👨‍🎓" label="Étudiants" value={stats.totalStudents || 0} trend="+12%" />
    <StatCard icon="🏢" label="Entreprises" value={stats.totalCompanies || 0} trend="+8%" />
    <StatCard icon="📋" label="Offres" value={stats.totalOffers || 0} trend="+15%" />
    <StatCard icon="📨" label="Candidatures" value={stats.totalApplications || 0} trend="+20%" />
    <StatCard icon="💬" label="Messages non lus" value={unreadMessages} link="/messaging" linkLabel="Voir les messages" />
    <StatCard icon="🚀" label="Accès rapide" value="" link="/messaging" linkLabel="Ouvrir la messagerie" highlight />
  </div>
);

export default StatisticsCards;