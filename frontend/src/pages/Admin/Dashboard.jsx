import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="simple-header">
        <h1>StageTrack - Dashboard Administrateur</h1>
        <div className="header-actions">
          <span>Connecté en tant que: {user?.email}</span>
          <button onClick={handleLogout}>Déconnexion</button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <button 
          className={selectedTab === 'stats' ? 'active' : ''}
          onClick={() => setSelectedTab('stats')}
        >
          📊 Statistiques
        </button>
        <button 
          className={selectedTab === 'users' ? 'active' : ''}
          onClick={() => setSelectedTab('users')}
        >
          👥 Utilisateurs ({users.length})
        </button>
        <button 
          className={selectedTab === 'offers' ? 'active' : ''}
          onClick={() => setSelectedTab('offers')}
        >
          💼 Offres ({offers.length})
        </button>
      </nav>

      {/* Contenu principal */}
      <main className="dashboard-content">
        {selectedTab === 'stats' && (
          <div className="stats-section">
            <h2>📊 Tableau de Bord Statistiques</h2>
            
            {/* Cartes de statistiques */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👨‍🎓</div>
                <div className="stat-content">
                  <h3>Étudiants</h3>
                  <span className="stat-value">{stats.totalStudents || 0}</span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🏢</div>
                <div className="stat-content">
                  <h3>Entreprises</h3>
                  <span className="stat-value">{stats.totalCompanies || 0}</span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-content">
                  <h3>Offres</h3>
                  <span className="stat-value">{stats.totalOffers || 0}</span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">📨</div>
                <div className="stat-content">
                  <h3>Candidatures</h3>
                  <span className="stat-value">{stats.totalApplications || 0}</span>
                </div>
              </div>
            </div>

            {/* Histogramme */}
            <div className="simple-charts">
              <div className="chart">
                <h4>📊 Histogramme des données</h4>
                <div className="bar-chart">
                  <div className="bars">
                    <div className="bar students" style={{ height: `${stats.totalStudents || 0}px` }}>
                      <span>{stats.totalStudents || 0}</span>
                    </div>
                    <div className="bar companies" style={{ height: `${stats.totalCompanies || 0}px` }}>
                      <span>{stats.totalCompanies || 0}</span>
                    </div>
                    <div className="bar offers" style={{ height: `${stats.totalOffers || 0}px` }}>
                      <span>{stats.totalOffers || 0}</span>
                    </div>
                  </div>
                  <div className="bar-labels">
                    <span>Étudiants</span>
                    <span>Entreprises</span>
                    <span>Offres</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Utilisateurs */}
        {selectedTab === 'users' && (
          <div className="users-section">
            <h2>👥 Gestion des utilisateurs</h2>
            
            <div className="table-container">
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
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
                          {user.active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          {user.active ? (
                            <button
                              onClick={() => handleUserAction(user._id, 'disable')}
                              className="btn-warning"
                            >
                              Désactiver
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUserAction(user._id, 'enable')}
                              className="btn-success"
                            >
                              Activer
                            </button>
                          )}
                          <button
                            onClick={() => handleUserAction(user._id, 'delete')}
                            className="btn-danger"
                          >
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

        {/* Offres */}
        {selectedTab === 'offers' && (
          <div className="offers-section">
            <h2>💼 Gestion des offres</h2>
            
            <div className="table-container">
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
                      <td>{offer.title}</td>
                      <td>{offer.companyId?.name || 'N/A'}</td>
                      <td>{offer.location}</td>
                      <td>{offer.duration}</td>
                      <td>
                        <span className={`status-badge ${offer.active ? 'active' : 'inactive'}`}>
                          {offer.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{new Date(offer.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          {offer.active ? (
                            <button
                              onClick={() => handleOfferAction(offer._id, 'deactivate')}
                              className="btn-warning"
                            >
                              Désactiver
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOfferAction(offer._id, 'activate')}
                              className="btn-success"
                            >
                              Activer
                            </button>
                          )}
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
    </div>
  );
};

export default AdminDashboard;
