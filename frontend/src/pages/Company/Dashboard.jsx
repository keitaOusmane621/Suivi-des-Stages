import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import './CompanyDashboard.css';

const CompanyDashboard = () => {
  const [offers, setOffers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('offers');
  const [unreadMessages, setUnreadMessages] = useState(0);
  
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
    fetchUnreadMessages();
    const interval = setInterval(fetchUnreadMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [offersResponse, applicationsResponse] = await Promise.all([
        api.get('/offers'),
        api.get('/applications/company-applications')
      ]);
      setOffers(offersResponse.data);
      setApplications(applicationsResponse.data);
      console.log('📦 Offres chargées:', offersResponse.data.length);
      console.log('📨 Candidatures chargées:', applicationsResponse.data.length);
    } catch (error) {
      console.error('❌ Erreur fetchData:', error);
      toast.error('Impossible de charger les données');
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
      toast.success('Offre créée avec succès !');
      fetchData();
    } catch (error) {
      console.error('❌ Erreur création offre:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    }
  };

  const handleUpdateStatus = async (applicationId, status) => {
    console.log(`🔄 Tentative de mise à jour du statut: ${status} pour la candidature ${applicationId}`);
    try {
      const response = await api.put(`/applications/${applicationId}/status`, { status });
      console.log('✅ Réponse du serveur:', response.data);
      toast.success(`Candidature ${status === 'accepted' ? 'acceptée' : 'refusée'} avec succès`);
      fetchData(); // Recharger les données
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du statut:', error);
      console.error('Détails:', error.response?.data);
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Déconnexion réussie');
  };

  const sendMessageToStudent = (studentId, studentName) => {
    navigate(`/messaging?student=${studentId}&name=${encodeURIComponent(studentName)}`);
  };

  // Fonction améliorée pour télécharger un fichier
  const downloadFile = (filePath, fileName) => {
    if (!filePath) {
      toast.error('Chemin du fichier manquant');
      return;
    }
    // Nettoyer le chemin (supprimer les antislashs si présents)
    const cleanPath = filePath.replace(/\\/g, '/');
    const url = `http://localhost:5000/${cleanPath}`;
    console.log(`📥 Téléchargement du fichier: ${url}`);
    // Ouvrir dans un nouvel onglet
    window.open(url, '_blank');
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
      {/* Header */}
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
          <button 
            className={`nav-tab ${selectedTab === 'offers' ? 'active' : ''}`}
            onClick={() => setSelectedTab('offers')}
          >
            <span className="tab-icon">💼</span> Mes Offres
            {offers.length > 0 && <span className="tab-badge">{offers.length}</span>}
          </button>
          <button 
            className={`nav-tab ${selectedTab === 'applications' ? 'active' : ''}`}
            onClick={() => setSelectedTab('applications')}
          >
            <span className="tab-icon">📨</span> Candidatures
            {applications.length > 0 && <span className="tab-badge">{applications.length}</span>}
          </button>
          <button 
            className={`nav-tab ${selectedTab === 'messages' ? 'active' : ''}`}
            onClick={() => navigate('/messaging')}
          >
            <span className="tab-icon">💬</span> Messages
            {unreadMessages > 0 && <span className="tab-badge notification">{unreadMessages}</span>}
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        {/* Section Offres (inchangée) */}
        {selectedTab === 'offers' && (
          <div className="offers-section">
            <div className="section-header">
              <div className="section-title">
                <h2>💼 Mes offres de stage</h2>
                <p>Gérez vos offres de stage publiées sur la plateforme</p>
              </div>
              <div className="header-stats">
                <div className="stat-item">
                  <div className="stat-number">{offers.length}</div>
                  <div className="stat-label">Offres</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{applications.length}</div>
                  <div className="stat-label">Candidatures</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{unreadMessages}</div>
                  <div className="stat-label">Messages</div>
                </div>
              </div>
            </div>

            <div className="quick-message-card card">
              <div className="quick-message-header">
                <span className="message-icon">💬</span>
                <h3>Messagerie instantanée</h3>
              </div>
              <p>Communiquez directement avec les candidats via notre système de messagerie sécurisé.</p>
              <div className="quick-message-actions">
                <Link to="/messaging" className="btn-primary">
                  <span className="btn-icon">📩</span> Ouvrir la messagerie
                </Link>
                {unreadMessages > 0 && (
                  <span className="unread-notice">
                    Vous avez {unreadMessages} message{unreadMessages > 1 ? 's' : ''} non lu{unreadMessages > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            <div className="section-header">
              <button 
                onClick={() => setShowOfferForm(!showOfferForm)}
                className={`btn-primary ${showOfferForm ? 'cancel' : ''}`}
              >
                <span className="btn-icon">{showOfferForm ? '✕' : '+'}</span>
                {showOfferForm ? 'Annuler' : 'Nouvelle offre'}
              </button>
            </div>

            {showOfferForm && (
              <form onSubmit={handleCreateOffer} className="offer-form card">
                <div className="form-header">
                  <h3>📝 Créer une nouvelle offre</h3>
                  <p>Remplissez les informations pour publier une nouvelle offre de stage</p>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Titre du poste *</label>
                    <input type="text" placeholder="Ex: Développeur Frontend" value={newOffer.title} onChange={(e) => setNewOffer({...newOffer, title: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Domaine *</label>
                    <input type="text" placeholder="Ex: Informatique, Marketing..." value={newOffer.domain} onChange={(e) => setNewOffer({...newOffer, domain: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lieu *</label>
                    <input type="text" placeholder="Ex: Paris, Télétravail..." value={newOffer.location} onChange={(e) => setNewOffer({...newOffer, location: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Durée *</label>
                    <input type="text" placeholder="Ex: 6 mois" value={newOffer.duration} onChange={(e) => setNewOffer({...newOffer, duration: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rémunération</label>
                    <input type="number" placeholder="Montant en €" value={newOffer.remuneration} onChange={(e) => setNewOffer({...newOffer, remuneration: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Compétences requises *</label>
                    <input type="text" placeholder="Séparées par des virgules (ex: React, JavaScript, Figma)" value={newOffer.skillsRequired} onChange={(e) => setNewOffer({...newOffer, skillsRequired: e.target.value})} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description détaillée *</label>
                  <textarea placeholder="Décrivez les missions, responsabilités et avantages du poste..." value={newOffer.description} onChange={(e) => setNewOffer({...newOffer, description: e.target.value})} required rows="5" />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary submit-btn">
                    <span className="btn-icon">🚀</span> Publier l'offre
                  </button>
                </div>
              </form>
            )}

            {offers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>Aucune offre créée</h3>
                <p>Commencez par créer votre première offre de stage</p>
                {!showOfferForm && (
                  <button onClick={() => setShowOfferForm(true)} className="btn-primary">
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
                      <div className="meta-item"><span className="meta-icon">🏷️</span> {offer.domain}</div>
                      <div className="meta-item"><span className="meta-icon">📍</span> {offer.location}</div>
                      <div className="meta-item"><span className="meta-icon">⏱️</span> {offer.duration}</div>
                      {offer.remuneration && <div className="meta-item"><span className="meta-icon">💰</span> {offer.remuneration}€/mois</div>}
                    </div>
                    <div className="offer-description"><p>{offer.description}</p></div>
                    {offer.skillsRequired && offer.skillsRequired.length > 0 && (
                      <div className="skills-section">
                        <h4>Compétences requises</h4>
                        <div className="skills-tags">
                          {offer.skillsRequired.map((skill, index) => <span key={index} className="skill-tag">{skill}</span>)}
                        </div>
                      </div>
                    )}
                    <div className="offer-footer">
                      <span className="date-text">Publiée le {new Date(offer.createdAt).toLocaleDateString('fr-FR')}</span>
                      <div className="offer-actions">
                        <button className="btn-secondary">Modifier</button>
                        <button className="btn-warning">{offer.active ? 'Désactiver' : 'Activer'}</button>
                        <Link to={`/messaging?offer=${offer._id}`} className="btn-info">💬 Messages</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section Candidatures AMÉLIORÉE */}
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
                  <span className="stat-value">{applications.filter(app => app.status === 'pending').length}</span>
                  <span className="stat-label">En attente</span>
                </span>
                <span className="stat-item">
                  <span className="stat-value">{unreadMessages}</span>
                  <span className="stat-label">Messages</span>
                </span>
              </div>
            </div>

            <div className="message-guide card">
              <div className="guide-header">
                <span className="guide-icon">💡</span>
                <h3>Communiquez avec vos candidats</h3>
              </div>
              <p>Utilisez notre système de messagerie intégré pour :</p>
              <ul className="guide-list">
                <li>✅ Poser des questions complémentaires</li>
                <li>✅ Proposer des entretiens</li>
                <li>✅ Fournir des retours personnalisés</li>
                <li>✅ Discuter des modalités du stage</li>
              </ul>
              <div className="guide-actions">
                <Link to="/messaging" className="btn-primary">
                  <span className="btn-icon">📨</span> Ouvrir la messagerie
                </Link>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📨</div>
                <h3>Aucune candidature reçue</h3>
                <p>Les candidatures pour vos offres apparaîtront ici</p>
                <button onClick={() => setSelectedTab('offers')} className="btn-primary">
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
                        <span className={`status-badge status-${app.status}`}>
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
                          <p className="applicant-email">{app.studentId?.email}</p>
                          {app.studentId?.education && (
                            <p className="applicant-education">🎓 {app.studentId.education}</p>
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

                    {/* Affichage des fichiers (CV et lettre de motivation) */}
                    <div className="application-files">
                      <div className="file-item">
                        <span className="file-icon">📄</span>
                        <span className="file-label">CV</span>
                        {app.cv ? (
                          <button 
                            className="btn-file"
                            onClick={() => downloadFile(app.cv, 'CV')}
                          >
                            Télécharger
                          </button>
                        ) : (
                          <span className="file-missing">Non fourni</span>
                        )}
                      </div>
                      <div className="file-item">
                        <span className="file-icon">📝</span>
                        <span className="file-label">Lettre de motivation</span>
                        {app.motivationLetter ? (
                          <button 
                            className="btn-file"
                            onClick={() => downloadFile(app.motivationLetter, 'Lettre_motivation')}
                          >
                            Télécharger
                          </button>
                        ) : (
                          <span className="file-missing">Non fournie</span>
                        )}
                      </div>
                    </div>

                    {app.message && (
                      <div className="motivation-section">
                        <div className="section-title">
                          <h5>💬 Message du candidat</h5>
                        </div>
                        <div className="motivation-content">
                          <p>{app.message}</p>
                        </div>
                      </div>
                    )}

                    <div className="application-actions">
                      <div className="status-info">
                        <span className="info-text">
                          Statut actuel: <strong>{app.status === 'pending' ? 'En attente' : app.status === 'accepted' ? 'Acceptée' : 'Refusée'}</strong>
                        </span>
                      </div>
                      <div className="action-buttons">
                        <button 
                          onClick={() => {
                            console.log('🔵 Clic sur Accepter pour la candidature:', app._id);
                            handleUpdateStatus(app._id, 'accepted');
                          }} 
                          className={`btn-success ${app.status === 'accepted' ? 'disabled' : ''}`}
                          disabled={app.status === 'accepted'}
                        >
                          <span className="btn-icon">✓</span> Accepter
                        </button>
                        <button 
                          onClick={() => {
                            console.log('🔴 Clic sur Refuser pour la candidature:', app._id);
                            handleUpdateStatus(app._id, 'rejected');
                          }} 
                          className={`btn-danger ${app.status === 'rejected' ? 'disabled' : ''}`}
                          disabled={app.status === 'rejected'}
                        >
                          <span className="btn-icon">✕</span> Refuser
                        </button>
                        <button className="btn-info">
                          <span className="btn-icon">👁️</span> Voir profil
                        </button>
                        <button 
                          onClick={() => sendMessageToStudent(app.studentId?._id, `${app.studentId?.firstName} ${app.studentId?.lastName}`)}
                          className="btn-primary"
                        >
                          <span className="btn-icon">💬</span> Message
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

      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-left">
            <span className="footer-text">© 2025 StageTrack Entreprise</span>
          </div>
          <div className="footer-right">
            <span className="footer-separator">•</span>
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