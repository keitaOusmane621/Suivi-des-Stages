import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
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
  const [unreadMessages, setUnreadMessages] = useState(0);
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchData();
    fetchUnreadMessages();
    const interval = setInterval(fetchUnreadMessages, 30000);
    return () => clearInterval(interval);
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
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadMessages = async () => {
    try {
      const mockUnread = Math.floor(Math.random() * 5);
      setUnreadMessages(mockUnread);
    } catch (error) {
      console.error('Erreur messages:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({ domain: '', location: '', duration: '' });
  };

  const sendMessageToCompany = (companyId, companyName) => {
    navigate(`/messaging?company=${companyId}&name=${encodeURIComponent(companyName)}`);
  };

  const downloadFile = (filePath, fileName) => {
    if (!filePath) return;
    const baseURL = 'http://localhost:5000/';
    const url = filePath.startsWith('/') ? filePath : `/${filePath}`;
    window.open(`${baseURL}${url}`, '_blank');
  };

  // 🔥 NOUVELLE FONCTION : Annuler une candidature (si en attente)
  const cancelApplication = async (applicationId) => {
    if (!window.confirm('Voulez-vous vraiment annuler cette candidature ?')) return;
    try {
      await api.delete(`/applications/${applicationId}`);
      toast.success('Candidature annulée');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'annulation');
    }
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
      <Toaster position="top-right" />
      
      {/* Header */}
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
            <Link to="/messaging" className="notification-btn">
              <span className="notification-icon">🔔</span>
              {unreadMessages > 0 && (
                <span className="notification-badge">
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </span>
              )}
            </Link>
            <Link to="/" className="home-btn">🏠 Accueil</Link>
            <button onClick={handleLogout} className="logout-btn">🚪 Déconnexion</button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <div className="nav-tabs">
          <button className={`nav-tab ${selectedTab === 'offers' ? 'active' : ''}`} onClick={() => setSelectedTab('offers')}>
            <span className="tab-icon">💼</span> Offres {offers.length > 0 && <span className="tab-badge">{offers.length}</span>}
          </button>
          <button className={`nav-tab ${selectedTab === 'applications' ? 'active' : ''}`} onClick={() => setSelectedTab('applications')}>
            <span className="tab-icon">📨</span> Candidatures {applications.length > 0 && <span className="tab-badge">{applications.length}</span>}
          </button>
          <button className={`nav-tab ${selectedTab === 'messages' ? 'active' : ''}`} onClick={() => navigate('/messaging')}>
            <span className="tab-icon">💬</span> Messages
            {unreadMessages > 0 && <span className="tab-badge notification">{unreadMessages}</span>}
          </button>
        </div>
      </nav>

      {/* Contenu */}
      <main className="dashboard-content">
        {/* Section Offres (inchangée) */}
        {selectedTab === 'offers' && (
          <div className="offers-section">
            {/* ... contenu existant ... */}
            <div className="section-header">
              <div className="section-title">
                <h2>💼 Offres de stage disponibles</h2>
                <p>Découvrez les opportunités de stage correspondant à votre profil</p>
              </div>
              <div className="header-stats">
                <div className="stat-item"><div className="stat-number">{offers.length}</div><div className="stat-label">Offres</div></div>
                <div className="stat-item"><div className="stat-number">{applications.length}</div><div className="stat-label">Candidatures</div></div>
                <div className="stat-item"><div className="stat-number">{unreadMessages}</div><div className="stat-label">Messages</div></div>
              </div>
            </div>

            <div className="quick-message-card card">
              <div className="quick-message-header">
                <span className="message-icon">💬</span>
                <h3>Communiquez avec les entreprises</h3>
              </div>
              <p>Posez des questions aux recruteurs avant de postuler ou suivez vos candidatures en direct.</p>
              <div className="quick-message-actions">
                <Link to="/messaging" className="btn-primary">📩 Ouvrir la messagerie</Link>
                {unreadMessages > 0 && (
                  <span className="unread-notice">Vous avez {unreadMessages} message{unreadMessages > 1 ? 's' : ''} non lu{unreadMessages > 1 ? 's' : ''}</span>
                )}
              </div>
            </div>

            <div className="filters-section card">
              <div className="filters-header">
                <h3>🔍 Filtres de recherche</h3>
                <button onClick={clearFilters} className="btn-secondary">Réinitialiser</button>
              </div>
              <div className="filters-grid">
                <div className="filter-group">
                  <label className="filter-label">Domaine</label>
                  <input type="text" name="domain" value={filters.domain} onChange={handleFilterChange} placeholder="Ex: Informatique" className="filter-input" />
                </div>
                <div className="filter-group">
                  <label className="filter-label">Lieu</label>
                  <input type="text" name="location" value={filters.location} onChange={handleFilterChange} placeholder="Ex: Paris" className="filter-input" />
                </div>
                <div className="filter-group">
                  <label className="filter-label">Durée</label>
                  <input type="text" name="duration" value={filters.duration} onChange={handleFilterChange} placeholder="Ex: 6 mois" className="filter-input" />
                </div>
              </div>
            </div>

            {filteredOffers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>Aucune offre correspondante</h3>
                <p>Essayez de modifier vos filtres</p>
                <button onClick={clearFilters} className="btn-primary">Voir toutes</button>
              </div>
            ) : (
              <div className="offers-grid">
                {filteredOffers.map(offer => (
                  <div key={offer._id} className="offer-card card">
                    <div className="offer-header">
                      <div className="offer-title-section">
                        <h3>{offer.title}</h3>
                        <span className="company-badge">🏢 {offer.companyId?.name || 'Entreprise'}</span>
                      </div>
                      <span className={`status-badge ${offer.active ? 'active' : 'inactive'}`}>
                        <span className="status-dot"></span> {offer.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="offer-meta">
                      <span className="meta-item">📍 {offer.location}</span>
                      <span className="meta-item">⏱️ {offer.duration}</span>
                      <span className="meta-item">🏷️ {offer.domain}</span>
                      {offer.remuneration && <span className="meta-item">💰 {offer.remuneration}€/mois</span>}
                    </div>
                    <div className="offer-description"><p>{offer.description}</p></div>
                    {offer.skillsRequired && offer.skillsRequired.length > 0 && (
                      <div className="skills-section">
                        <h4>Compétences requises</h4>
                        <div className="skills-tags">
                          {offer.skillsRequired.map((skill, idx) => <span key={idx} className="skill-tag">{skill}</span>)}
                        </div>
                      </div>
                    )}
                    <div className="offer-footer">
                      <span className="date-text">Publiée le {new Date(offer.createdAt).toLocaleDateString('fr-FR')}</span>
                      <div className="offer-actions">
                        <button className="btn-info" onClick={() => navigate(`/offer/${offer._id}`)}>👁️ Voir</button>
                        <button className="btn-secondary" onClick={() => sendMessageToCompany(offer.companyId?._id, offer.companyId?.name)}>💬 Contacter</button>
                        <Link to={`/apply/${offer._id}`} className="btn-primary">📝 Postuler</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section Candidatures améliorée */}
        {selectedTab === 'applications' && (
          <div className="applications-section">
            <div className="section-header">
              <div className="section-title">
                <h2>📨 Mes candidatures</h2>
                <p>Suivez l'état de vos candidatures</p>
              </div>
              <div className="stats-summary">
                <span className="stat-item"><span className="stat-value">{applications.length}</span><span className="stat-label">Total</span></span>
                <span className="stat-item"><span className="stat-value">{applications.filter(a => a.status === 'accepted').length}</span><span className="stat-label">Acceptées</span></span>
                <span className="stat-item"><span className="stat-value">{applications.filter(a => a.status === 'pending').length}</span><span className="stat-label">En attente</span></span>
                <span className="stat-item"><span className="stat-value">{unreadMessages}</span><span className="stat-label">Messages</span></span>
              </div>
            </div>

            <div className="message-guide card">
              <div className="guide-header">
                <span className="guide-icon">💡</span>
                <h3>Restez en contact</h3>
              </div>
              <p>Utilisez notre messagerie pour :</p>
              <ul className="guide-list">
                <li>✅ Poser des questions</li>
                <li>✅ Suivre vos candidatures</li>
                <li>✅ Organiser un entretien</li>
              </ul>
              <div className="guide-actions">
                <Link to="/messaging" className="btn-primary">📨 Ouvrir la messagerie</Link>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>Aucune candidature</h3>
                <p>Postulez à des offres dès maintenant</p>
                <button onClick={() => setSelectedTab('offers')} className="btn-primary">Explorer</button>
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
                      <span className="date-text">Postulé le {new Date(app.createdAt).toLocaleDateString('fr-FR')}</span>
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

                    <div className="application-files">
                      <div className="file-item">
                        <span className="file-icon">📄</span>
                        <span className="file-label">CV</span>
                        {app.cv ? (
                          <button className="btn-file" onClick={() => downloadFile(app.cv, 'CV')}>Télécharger</button>
                        ) : <span className="file-missing">Non fourni</span>}
                      </div>
                      <div className="file-item">
                        <span className="file-icon">📝</span>
                        <span className="file-label">Lettre de motivation</span>
                        {app.motivationLetter ? (
                          <button className="btn-file" onClick={() => downloadFile(app.motivationLetter, 'Lettre_motivation')}>Télécharger</button>
                        ) : <span className="file-missing">Non fournie</span>}
                      </div>
                    </div>

                    {app.message && (
                      <div className="motivation-section">
                        <h5>💬 Message associé</h5>
                        <p>{app.message}</p>
                      </div>
                    )}

                    <div className="application-footer">
                      <div className="application-actions">
                        <button className="btn-info" onClick={() => sendMessageToCompany(app.offerId?.companyId?._id, app.offerId?.companyId?.name)}>
                          ✉️ Contacter
                        </button>
                        {/* 🔥 Bouton Annuler (si en attente) */}
                        {app.status === 'pending' && (
                          <button className="btn-danger" onClick={() => cancelApplication(app._id)}>
                            <span className="btn-icon">✕</span> Annuler
                          </button>
                        )}
                        <Link to="/messaging" className="btn-primary">💬 Messagerie</Link>
                      </div>
                      <div className="application-status">
                        <span className="status-update">Dernière mise à jour : {new Date(app.updatedAt).toLocaleDateString('fr-FR')}</span>
                        {app.status === 'pending' && (
                          <span className="status-hint">💡 En attente de réponse de l'entreprise</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-left">© 2025 StageTrack Étudiant</div>
          <div className="footer-right">
            {offers.length} offres • {applications.length} candidatures
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentDashboard;