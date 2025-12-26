import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('stats');
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsResponse, usersResponse, offersResponse] = await Promise.all([
        api.get('/admin/dashboard-stats'),
        api.get('/admin/users'),
        api.get('/offers')
      ]);
      
      setStats(statsResponse.data);
      setUsers(usersResponse.data);
      setOffers(offersResponse.data);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Accès non autorisé');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      await api.put(`/admin/users/${userId}`, { action });
      alert(`Utilisateur ${action === 'disable' ? 'désactivé' : 'activé'} avec succès`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de l\'action');
    }
  };

  const handleOfferAction = async (offerId, action) => {
    try {
      await api.put(`/admin/offers/${offerId}`, { action });
      alert(`Offre ${action === 'deactivate' ? 'désactivée' : 'activée'} avec succès`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de l\'action');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header amélioré avec navigation */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">StageTrack Admin</span>
          </div>
        </div>
        
        <div className="header-center">
          <h1>Tableau de Bord Administrateur</h1>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <span className="user-avatar">👤</span>
            <span className="user-email">{user?.email}</span>
          </div>
          
          <div className="header-actions">
            <Link to="/" className="home-btn">
              <span className="btn-icon">🏠</span>
              Accueil
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              <span className="btn-icon">🚪</span>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Navigation principale */}
      <nav className="dashboard-nav">
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${selectedTab === 'stats' ? 'active' : ''}`}
            onClick={() => setSelectedTab('stats')}
          >
            <span className="tab-icon">📊</span>
            <span className="tab-text">Statistiques</span>
            {stats.totalStudents && <span className="tab-badge">{stats.totalStudents + stats.totalCompanies || 0}</span>}
          </button>
          
          <button 
            className={`nav-tab ${selectedTab === 'users' ? 'active' : ''}`}
            onClick={() => setSelectedTab('users')}
          >
            <span className="tab-icon">👥</span>
            <span className="tab-text">Utilisateurs</span>
            {users.length > 0 && <span className="tab-badge">{users.length}</span>}
          </button>
          
          <button 
            className={`nav-tab ${selectedTab === 'offers' ? 'active' : ''}`}
            onClick={() => setSelectedTab('offers')}
          >
            <span className="tab-icon">💼</span>
            <span className="tab-text">Offres</span>
            {offers.length > 0 && <span className="tab-badge">{offers.length}</span>}
          </button>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="dashboard-content">
        {/* Section Statistiques */}
        {selectedTab === 'stats' && (
          <div className="stats-section">
            <div className="section-header">
              <h2>📊 Vue d'ensemble</h2>
              <p>Statistiques globales de la plateforme</p>
            </div>
            
            {/* Cartes de statistiques */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-icon">👨‍🎓</span>
                  <h3>Étudiants</h3>
                </div>
                <div className="stat-card-body">
                  <span className="stat-value">{stats.totalStudents || 0}</span>
                  <span className="stat-label">Inscrits sur la plateforme</span>
                </div>
                <div className="stat-card-footer">
                  <span className="stat-trend positive">+12% ce mois</span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-icon">🏢</span>
                  <h3>Entreprises</h3>
                </div>
                <div className="stat-card-body">
                  <span className="stat-value">{stats.totalCompanies || 0}</span>
                  <span className="stat-label">Entreprises partenaires</span>
                </div>
                <div className="stat-card-footer">
                  <span className="stat-trend positive">+8% ce mois</span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-icon">📋</span>
                  <h3>Offres</h3>
                </div>
                <div className="stat-card-body">
                  <span className="stat-value">{stats.totalOffers || 0}</span>
                  <span className="stat-label">Offres publiées</span>
                </div>
                <div className="stat-card-footer">
                  <span className="stat-trend positive">+15% ce mois</span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-icon">📨</span>
                  <h3>Candidatures</h3>
                </div>
                <div className="stat-card-body">
                  <span className="stat-value">{stats.totalApplications || 0}</span>
                  <span className="stat-label">Candidatures déposées</span>
                </div>
                <div className="stat-card-footer">
                  <span className="stat-trend positive">+20% ce mois</span>
                </div>
              </div>
            </div>

            {/* Graphique */}
            <div className="chart-section">
              <div className="chart-header">
                <h3>📈 Évolution des données</h3>
                <div className="chart-legend">
                  <span className="legend-item students">Étudiants</span>
                  <span className="legend-item companies">Entreprises</span>
                  <span className="legend-item offers">Offres</span>
                </div>
              </div>
              
              <div className="bar-chart-container">
                <div className="bar-chart">
                  <div className="bar-chart-bars">
                    <div className="bar-chart-bar" style={{ height: `${(stats.totalStudents || 0) * 2}px` }}>
                      <span className="bar-value">{stats.totalStudents || 0}</span>
                      <div className="bar-fill students"></div>
                    </div>
                    <div className="bar-chart-bar" style={{ height: `${(stats.totalCompanies || 0) * 3}px` }}>
                      <span className="bar-value">{stats.totalCompanies || 0}</span>
                      <div className="bar-fill companies"></div>
                    </div>
                    <div className="bar-chart-bar" style={{ height: `${(stats.totalOffers || 0) * 1.5}px` }}>
                      <span className="bar-value">{stats.totalOffers || 0}</span>
                      <div className="bar-fill offers"></div>
                    </div>
                  </div>
                  <div className="bar-chart-labels">
                    <span>Étudiants</span>
                    <span>Entreprises</span>
                    <span>Offres</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Utilisateurs */}
        {selectedTab === 'users' && (
          <div className="users-section">
            <div className="section-header">
              <h2>👥 Gestion des utilisateurs</h2>
              <p>Gérez les comptes étudiants et entreprises</p>
            </div>
            
            <div className="table-container">
              <div className="table-header">
                <div className="table-title">
                  <span className="table-count">{users.length} utilisateurs</span>
                </div>
                <div className="table-filters">
                  <button className="filter-btn active">Tous</button>
                  <button className="filter-btn">Étudiants</button>
                  <button className="filter-btn">Entreprises</button>
                </div>
              </div>
              
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>Date d'inscription</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>
                        <div className="user-cell">
                          <span className="user-avatar-small">👤</span>
                          <span className="user-email">{user.email}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role === 'student' ? 'Étudiant' : 'Entreprise'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
                          <span className="status-dot"></span>
                          {user.active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <div className="action-buttons">
                          {user.active ? (
                            <button
                              onClick={() => handleUserAction(user._id, 'disable')}
                              className="btn-warning"
                            >
                              <span className="btn-icon">⏸️</span>
                              Suspendre
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUserAction(user._id, 'enable')}
                              className="btn-success"
                            >
                              <span className="btn-icon">▶️</span>
                              Activer
                            </button>
                          )}
                          <button
                            onClick={() => handleUserAction(user._id, 'delete')}
                            className="btn-danger"
                          >
                            <span className="btn-icon">🗑️</span>
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section Offres */}
        {selectedTab === 'offers' && (
          <div className="offers-section">
            <div className="section-header">
              <h2>💼 Gestion des offres</h2>
              <p>Gérez les offres de stage publiées</p>
            </div>
            
            <div className="table-container">
              <div className="table-header">
                <div className="table-title">
                  <span className="table-count">{offers.length} offres</span>
                </div>
                <div className="table-filters">
                  <button className="filter-btn active">Toutes</button>
                  <button className="filter-btn">Actives</button>
                  <button className="filter-btn">Inactives</button>
                </div>
              </div>
              
              <table className="offers-table">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Entreprise</th>
                    <th>Lieu</th>
                    <th>Durée</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map(offer => (
                    <tr key={offer._id}>
                      <td>
                        <div className="offer-title">
                          <strong>{offer.title}</strong>
                        </div>
                      </td>
                      <td>{offer.companyId?.name || 'N/A'}</td>
                      <td>
                        <span className="location-badge">
                          📍 {offer.location}
                        </span>
                      </td>
                      <td>{offer.duration}</td>
                      <td>
                        <span className={`status-badge ${offer.active ? 'active' : 'inactive'}`}>
                          <span className="status-dot"></span>
                          {offer.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{new Date(offer.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <div className="action-buttons">
                          {offer.active ? (
                            <button
                              onClick={() => handleOfferAction(offer._id, 'deactivate')}
                              className="btn-warning"
                            >
                              <span className="btn-icon">⏸️</span>
                              Désactiver
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOfferAction(offer._id, 'activate')}
                              className="btn-success"
                            >
                              <span className="btn-icon">▶️</span>
                              Activer
                            </button>
                          )}
                          <button className="btn-info">
                            <span className="btn-icon">👁️</span>
                            Voir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-left">
            <span className="footer-text">© 2025 StageTrack Admin</span>
          </div>
          <div className="footer-right">
            <Link to="/" className="footer-link">
              <span className="footer-icon">🏠</span>
              Retour à l'accueil
            </Link>
            <span className="footer-separator">•</span>
            <span className="footer-text"></span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
