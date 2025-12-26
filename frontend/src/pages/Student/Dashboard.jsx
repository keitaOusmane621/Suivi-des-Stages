import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import './Dashboard.css';

const StudentDashboard = () => {
  const [offers, setOffers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('offers');
  const [filters, setFilters] = useState({
    domain: '',
    location: '',
    duration: ''
  });
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [offersResponse, applicationsResponse] = await Promise.all([
        api.get('/offers'),
        api.get('/applications/my-applications')
      ]);
      
      setOffers(offersResponse.data);
      setApplications(applicationsResponse.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (offerId) => {
    try {
      const motivationLetter = prompt('Entrez votre lettre de motivation:');
      if (motivationLetter) {
        await api.post(`/applications/offers/${offerId}/apply`, { motivationLetter });
        alert('Candidature envoyée avec succès !');
        fetchData();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la candidature');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const clearFilters = () => {
    setFilters({
      domain: '',
      location: '',
      duration: ''
    });
  };

  const filteredOffers = offers.filter(offer => {
    if (filters.domain && !offer.domain.toLowerCase().includes(filters.domain.toLowerCase())) return false;
    if (filters.location && !offer.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.duration && !offer.duration.toLowerCase().includes(filters.duration.toLowerCase())) return false;
    return true;
  });

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
      {/* Header amélioré */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">StageTrack Étudiant</span>
          </div>
        </div>
        
        <div className="header-center">
          <h1>Tableau de Bord Étudiant</h1>
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

      {/* Navigation par onglets */}
      <nav className="dashboard-nav">
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${selectedTab === 'offers' ? 'active' : ''}`}
            onClick={() => setSelectedTab('offers')}
          >
            <span className="tab-icon">💼</span>
            <span className="tab-text">Offres de Stage</span>
            {offers.length > 0 && <span className="tab-badge">{offers.length}</span>}
          </button>
          
          <button 
            className={`nav-tab ${selectedTab === 'applications' ? 'active' : ''}`}
            onClick={() => setSelectedTab('applications')}
          >
            <span className="tab-icon">📨</span>
            <span className="tab-text">Mes Candidatures</span>
            {applications.length > 0 && <span className="tab-badge">{applications.length}</span>}
          </button>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="dashboard-content">
        {/* Section Offres */}
        {selectedTab === 'offers' && (
          <div className="offers-section">
            <div className="section-header">
              <div className="section-title">
                <h2>💼 Offres de stage disponibles</h2>
                <p>Découvrez les opportunités de stage correspondant à votre profil</p>
              </div>
              
              <div className="stats-summary">
                <span className="stat-item">
                  <span className="stat-value">{offers.length}</span>
                  <span className="stat-label">Offres</span>
                </span>
                
                <span className="stat-item">
                  <span className="stat-value">{filteredOffers.length}</span>
                  <span className="stat-label">Filtrées</span>
                </span>
              </div>
            </div>

            {/* Filtres */}
            <div className="filters-section card">
              <div className="filters-header">
                <h3>🔍 Filtres de recherche</h3>
                <button onClick={clearFilters} className="btn-secondary">
                  Réinitialiser
                </button>
              </div>
              
              <div className="filters-grid">
                <div className="filter-group">
                  <label className="filter-label">Domaine</label>
                  <input
                    type="text"
                    name="domain"
                    value={filters.domain}
                    onChange={handleFilterChange}
                    placeholder="Ex: Informatique, Marketing..."
                    className="filter-input"
                  />
                </div>
                
                <div className="filter-group">
                  <label className="filter-label">Lieu</label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="Ex: Paris, Télétravail..."
                    className="filter-input"
                  />
                </div>
                
                <div className="filter-group">
                  <label className="filter-label">Durée</label>
                  <input
                    type="text"
                    name="duration"
                    value={filters.duration}
                    onChange={handleFilterChange}
                    placeholder="Ex: 6 mois, 3 mois..."
                    className="filter-input"
                  />
                </div>
              </div>
            </div>

            {/* Liste des offres */}
            {filteredOffers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>Aucune offre ne correspond à vos critères</h3>
                <p>Essayez de modifier vos filtres ou revenez plus tard</p>
                <button onClick={clearFilters} className="btn-primary">
                  Afficher toutes les offres
                </button>
              </div>
            ) : (
              <div className="offers-grid">
                {filteredOffers.map(offer => (
                  <div key={offer._id} className="offer-card card">
                    <div className="offer-header">
                      <div className="offer-title-section">
                        <h3>{offer.title}</h3>
                        <span className="company-badge">
                          <span className="company-icon">🏢</span>
                          {offer.companyId?.name || 'Entreprise'}
                        </span>
                      </div>
                      
                      <span className={`status-badge ${offer.active ? 'active' : 'inactive'}`}>
                        <span className="status-dot"></span>
                        {offer.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="offer-meta">
                      <div className="meta-item">
                        <span className="meta-icon">📍</span>
                        <span className="meta-text">{offer.location}</span>
                      </div>
                      
                      <div className="meta-item">
                        <span className="meta-icon">⏱️</span>
                        <span className="meta-text">{offer.duration}</span>
                      </div>
                      
                      <div className="meta-item">
                        <span className="meta-icon">🏷️</span>
                        <span className="meta-text">{offer.domain}</span>
                      </div>
                      
                      {offer.remuneration && (
                        <div className="meta-item">
                          <span className="meta-icon">💰</span>
                          <span className="meta-text">{offer.remuneration}€/mois</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="offer-description">
                      <p>{offer.description}</p>
                    </div>
                    
                    {offer.skillsRequired && offer.skillsRequired.length > 0 && (
                      <div className="skills-section">
                        <h4>Compétences requises</h4>
                        <div className="skills-tags">
                          {offer.skillsRequired.map((skill, index) => (
                            <span key={index} className="skill-tag">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="offer-footer">
                      <span className="date-text">
                        Publiée le {new Date(offer.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                      
                      <div className="offer-actions">
                        <button 
                          className="btn-info"
                          onClick={() => navigate(`/offer/${offer._id}`)}
                        >
                          <span className="btn-icon">👁️</span>
                          Voir détails
                        </button>
                        
                        <button 
                          className="btn-primary" 
                          onClick={() => handleApply(offer._id)}
                        >
                          <span className="btn-icon">📝</span>
                          Postuler
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section Candidatures */}
        {selectedTab === 'applications' && (
          <div className="applications-section">
            <div className="section-header">
              <div className="section-title">
                <h2>📨 Mes candidatures</h2>
                <p>Suivez l'état de vos candidatures aux offres de stage</p>
              </div>
              
              <div className="stats-summary">
                <span className="stat-item">
                  <span className="stat-value">{applications.length}</span>
                  <span className="stat-label">Total</span>
                </span>
                
                <span className="stat-item">
                  <span className="stat-value">
                    {applications.filter(app => app.status === 'accepted').length}
                  </span>
                  <span className="stat-label">Acceptées</span>
                </span>
                
                <span className="stat-item">
                  <span className="stat-value">
                    {applications.filter(app => app.status === 'pending').length}
                  </span>
                  <span className="stat-label">En attente</span>
                </span>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>Vous n'avez encore postulé à aucune offre</h3>
                <p>Parcourez les offres de stage disponibles et postulez !</p>
                <button 
                  onClick={() => setSelectedTab('offers')}
                  className="btn-primary"
                >
                  Explorer les offres
                </button>
              </div>
            ) : (
              <div className="applications-grid">
                {applications.map(app => (
                  <div key={app._id} className="application-card card">
                    <div className="application-header">
                      <div className="application-title">
                        <h3>{app.offerId?.title}</h3>
                        <span className={`status-badge ${app.status}`}>
                          <span className="status-dot"></span>
                          {app.status === 'pending' ? 'En attente' : 
                           app.status === 'accepted' ? 'Acceptée' : 'Refusée'}
                        </span>
                      </div>
                      
                      <span className="date-text">
                        Postulé le {new Date(app.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    
                    <div className="application-details">
                      <div className="detail-item">
                        <span className="detail-label">Entreprise</span>
                        <span className="detail-value">{app.offerId?.companyId?.name || 'Non spécifié'}</span>
                      </div>
                      
                      <div className="detail-item">
                        <span className="detail-label">Lieu</span>
                        <span className="detail-value">{app.offerId?.location}</span>
                      </div>
                      
                      <div className="detail-item">
                        <span className="detail-label">Durée</span>
                        <span className="detail-value">{app.offerId?.duration}</span>
                      </div>
                      
                      <div className="detail-item">
                        <span className="detail-label">Domaine</span>
                        <span className="detail-value">{app.offerId?.domain}</span>
                      </div>
                    </div>
                    
                    {app.motivationLetter && (
                      <div className="motivation-section">
                        <div className="section-title">
                          <h5>📝 Votre lettre de motivation</h5>
                        </div>
                        <div className="motivation-preview">
                          <p>{app.motivationLetter.substring(0, 150)}...</p>
                          <button className="btn-text">
                            Lire la suite
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="application-footer">
                      <div className="application-actions">
                        <button className="btn-secondary">
                          <span className="btn-icon">📄</span>
                          Télécharger CV
                        </button>
                        
                        <button className="btn-info">
                          <span className="btn-icon">✉️</span>
                          Contacter l'entreprise
                        </button>
                      </div>
                      
                      <div className="application-status">
                        <span className="status-update">
                          {new Date(app.updatedAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-left">
            <span className="footer-text">© 2025 StageTrack Étudiant</span>
          </div>
          
          <div className="footer-right">
            <Link to="/" className="footer-link">
              <span className="footer-icon">🏠</span>
              Retour à l'accueil
            </Link>
            <span className="footer-separator">•</span>
            <span className="footer-text">
              {offers.length} offres • {applications.length} candidatures
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentDashboard;
