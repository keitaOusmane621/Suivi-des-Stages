import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import './CompanyDashboard.css';

const CompanyDashboard = () => {
  const [offers, setOffers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('offers');
  
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    domain: '',
    location: '',
    duration: '',
    skillsRequired: '',
    remuneration: ''
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
        api.get('/applications/company-applications')
      ]);
      
      setOffers(offersResponse.data);
      setApplications(applicationsResponse.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    try {
      await api.post('/offers', {
        ...newOffer,
        skillsRequired: newOffer.skillsRequired.split(',').map(skill => skill.trim())
      });
      
      setNewOffer({
        title: '',
        description: '',
        domain: '',
        location: '',
        duration: '',
        skillsRequired: '',
        remuneration: ''
      });
      
      setShowOfferForm(false);
      alert('Offre créée avec succès !');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la création');
    }
  };

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status });
      alert('Statut mis à jour !');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la mise à jour');
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
      {/* Header amélioré */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">🏢</span>
            <span className="logo-text">StageTrack Entreprise</span>
          </div>
        </div>
        
        <div className="header-center">
          <h1>Tableau de Bord Entreprise</h1>
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
            <span className="tab-text">Mes Offres</span>
            {offers.length > 0 && <span className="tab-badge">{offers.length}</span>}
          </button>
          
          <button 
            className={`nav-tab ${selectedTab === 'applications' ? 'active' : ''}`}
            onClick={() => setSelectedTab('applications')}
          >
            <span className="tab-icon">📨</span>
            <span className="tab-text">Candidatures</span>
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
                <h2>💼 Mes offres de stage</h2>
                <p>Gérez vos offres de stage publiées sur la plateforme</p>
              </div>
              
              <button 
                onClick={() => setShowOfferForm(!showOfferForm)}
                className={`btn-primary ${showOfferForm ? 'cancel' : ''}`}
              >
                <span className="btn-icon">{showOfferForm ? '✕' : '+'}</span>
                {showOfferForm ? 'Annuler' : 'Nouvelle offre'}
              </button>
            </div>

            {/* Formulaire de création d'offre */}
            {showOfferForm && (
              <form onSubmit={handleCreateOffer} className="offer-form card">
                <div className="form-header">
                  <h3>📝 Créer une nouvelle offre</h3>
                  <p>Remplissez les informations pour publier une nouvelle offre de stage</p>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Titre du poste *</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Développeur Frontend" 
                      value={newOffer.title} 
                      onChange={(e) => setNewOffer({...newOffer, title: e.target.value})} 
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Domaine *</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Informatique, Marketing..." 
                      value={newOffer.domain} 
                      onChange={(e) => setNewOffer({...newOffer, domain: e.target.value})} 
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Lieu *</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Paris, Télétravail..." 
                      value={newOffer.location} 
                      onChange={(e) => setNewOffer({...newOffer, location: e.target.value})} 
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Durée *</label>
                    <input 
                      type="text" 
                      placeholder="Ex: 6 mois" 
                      value={newOffer.duration} 
                      onChange={(e) => setNewOffer({...newOffer, duration: e.target.value})} 
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Rémunération</label>
                    <input 
                      type="number" 
                      placeholder="Montant en €" 
                      value={newOffer.remuneration} 
                      onChange={(e) => setNewOffer({...newOffer, remuneration: e.target.value})} 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Compétences requises *</label>
                    <input 
                      type="text" 
                      placeholder="Séparées par des virgules (ex: React, JavaScript, Figma)" 
                      value={newOffer.skillsRequired} 
                      onChange={(e) => setNewOffer({...newOffer, skillsRequired: e.target.value})} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Description détaillée *</label>
                  <textarea 
                    placeholder="Décrivez les missions, responsabilités et avantages du poste..." 
                    value={newOffer.description} 
                    onChange={(e) => setNewOffer({...newOffer, description: e.target.value})} 
                    required 
                    rows="5" 
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn-primary submit-btn">
                    <span className="btn-icon">🚀</span>
                    Publier l'offre
                  </button>
                </div>
              </form>
            )}

            {/* Liste des offres */}
            {offers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>Aucune offre créée</h3>
                <p>Commencez par créer votre première offre de stage</p>
                {!showOfferForm && (
                  <button 
                    onClick={() => setShowOfferForm(true)}
                    className="btn-primary"
                  >
                    Créer ma première offre
                  </button>
                )}
              </div>
            ) : (
              <div className="offers-grid">
                {offers.map(offer => (
                  <div key={offer._id} className="offer-card card">
                    <div className="offer-header">
                      <h3>{offer.title}</h3>
                      <span className={`status-badge ${offer.active ? 'active' : 'inactive'}`}>
                        <span className="status-dot"></span>
                        {offer.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="offer-meta">
                      <div className="meta-item">
                        <span className="meta-icon">🏷️</span>
                        <span className="meta-text">{offer.domain}</span>
                      </div>
                      
                      <div className="meta-item">
                        <span className="meta-icon">📍</span>
                        <span className="meta-text">{offer.location}</span>
                      </div>
                      
                      <div className="meta-item">
                        <span className="meta-icon">⏱️</span>
                        <span className="meta-text">{offer.duration}</span>
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
                        <button className="btn-secondary">Modifier</button>
                        <button className="btn-warning">
                          {offer.active ? 'Désactiver' : 'Activer'}
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
                <h2>📨 Candidatures reçues</h2>
                <p>Gérez les candidatures pour vos offres de stage</p>
              </div>
              
              <div className="stats-summary">
                <span className="stat-item">
                  <span className="stat-value">{applications.length}</span>
                  <span className="stat-label">Total</span>
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
                <div className="empty-icon">📨</div>
                <h3>Aucune candidature reçue</h3>
                <p>Les candidatures pour vos offres </p>
                <button 
                  onClick={() => setSelectedTab('offers')}
                  className="btn-primary"
                >
                  Voir mes offres
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
                    
                    <div className="applicant-info">
                      <div className="applicant-header">
                        <div className="applicant-avatar">
                          <span className="avatar-icon">👤</span>
                        </div>
                        
                        <div className="applicant-details">
                          <h4>{app.studentId?.firstName} {app.studentId?.lastName}</h4>
                          {app.studentId?.education && (
                            <p className="applicant-education">
                              <span className="edu-icon">🎓</span>
                              {app.studentId.education}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {app.studentId?.skills && app.studentId.skills.length > 0 && (
                        <div className="applicant-skills">
                          <h5>Compétences</h5>
                          <div className="skills-tags">
                            {app.studentId.skills.map((skill, index) => (
                              <span key={index} className="skill-tag">{skill}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {app.motivationLetter && (
                      <div className="motivation-section">
                        <div className="section-title">
                          <h5>📝 Lettre de motivation</h5>
                        </div>
                        <div className="motivation-content">
                          <p>{app.motivationLetter}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="application-actions">
                      <div className="status-info">
                        <span className="info-text">
                          Statut actuel: <strong>{app.status}</strong>
                        </span>
                      </div>
                      
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleUpdateStatus(app._id, 'accepted')} 
                          className={`btn-success ${app.status === 'accepted' ? 'disabled' : ''}`}
                          disabled={app.status === 'accepted'}
                        >
                          <span className="btn-icon">✓</span>
                          Accepter
                        </button>
                        
                        <button 
                          onClick={() => handleUpdateStatus(app._id, 'rejected')} 
                          className={`btn-danger ${app.status === 'rejected' ? 'disabled' : ''}`}
                          disabled={app.status === 'rejected'}
                        >
                          <span className="btn-icon">✕</span>
                          Refuser
                        </button>
                        
                        <button className="btn-info">
                          <span className="btn-icon">👁️</span>
                          Voir profil
                        </button>
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
            <span className="footer-text">© 2025 StageTrack Entreprise</span>
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

export default CompanyDashboard;
