import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Dashboard Entreprise</h1>
        <div className="user-info">
          <span>Bienvenue, {user?.email}</span>
          <button onClick={handleLogout} className="btn-logout">Déconnexion</button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="dashboard-nav">
        <button 
          className={selectedTab === 'offers' ? 'active' : ''}
          onClick={() => setSelectedTab('offers')}
        >
          Mes offres ({offers.length})
        </button>
        <button 
          className={selectedTab === 'applications' ? 'active' : ''}
          onClick={() => setSelectedTab('applications')}
        >
          Candidatures ({applications.length})
        </button>
      </nav>

      {/* Content */}
      <main className="dashboard-content">
        {selectedTab === 'offers' && (
          <div className="offers-section">
            <div className="section-header">
              <h2>Mes offres de stage</h2>
              <button 
                onClick={() => setShowOfferForm(!showOfferForm)}
                className="btn-primary"
              >
                {showOfferForm ? 'Annuler' : '+ Nouvelle offre'}
              </button>
            </div>

            {showOfferForm && (
              <form onSubmit={handleCreateOffer} className="offer-form">
                <h3>Créer une nouvelle offre</h3>
                <div className="form-grid">
                  <input type="text" placeholder="Titre du poste" value={newOffer.title} onChange={(e) => setNewOffer({...newOffer, title: e.target.value})} required />
                  <input type="text" placeholder="Domaine" value={newOffer.domain} onChange={(e) => setNewOffer({...newOffer, domain: e.target.value})} required />
                  <input type="text" placeholder="Lieu" value={newOffer.location} onChange={(e) => setNewOffer({...newOffer, location: e.target.value})} required />
                  <input type="text" placeholder="Durée (ex: 6 mois)" value={newOffer.duration} onChange={(e) => setNewOffer({...newOffer, duration: e.target.value})} required />
                  <input type="number" placeholder="Rémunération (€)" value={newOffer.remuneration} onChange={(e) => setNewOffer({...newOffer, remuneration: e.target.value})} />
                  <input type="text" placeholder="Compétences requises (séparées par des virgules)" value={newOffer.skillsRequired} onChange={(e) => setNewOffer({...newOffer, skillsRequired: e.target.value})} required />
                </div>
                <textarea placeholder="Description détaillée du poste" value={newOffer.description} onChange={(e) => setNewOffer({...newOffer, description: e.target.value})} required rows="4" />
                <button type="submit" className="btn-primary">Publier l'offre</button>
              </form>
            )}

            <div className="offers-grid">
              {offers.length === 0 ? <p>Aucune offre créée pour le moment.</p> : offers.map(offer => (
                <div key={offer._id} className="offer-card">
                  <h3>{offer.title}</h3>
                  <p className="domain">{offer.domain}</p>
                  <p className="location">{offer.location}</p>
                  <p className="duration">{offer.duration}</p>
                  {offer.remuneration && <p className="remuneration">{offer.remuneration}€/mois</p>}
                  <p className="description">{offer.description}</p>
                  <div className="skills">{offer.skillsRequired?.map(skill => <span key={skill} className="skill-tag">{skill}</span>)}</div>
                  <p className={`status ${offer.active ? 'active' : 'inactive'}`}>
                    {offer.active ? '🟢 Active' : '🔴 Inactive'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'applications' && (
          <div className="applications-section">
            <h2>Candidatures reçues</h2>
            {applications.length === 0 ? <p>Aucune candidature reçue pour le moment.</p> : (
              <div className="applications-grid">
                {applications.map(app => (
                  <div key={app._id} className="application-card">
                    <div className="application-header">
                      <h3>{app.offerId?.title}</h3>
                      <span className={`status ${app.status}`}>{app.status}</span>
                    </div>
                    <div className="applicant-info">
                      <h4>Candidat:</h4>
                      <p>{app.studentId?.firstName} {app.studentId?.lastName}</p>
                      <p>{app.studentId?.education}</p>
                      {app.studentId?.skills && <div className="skills">{app.studentId.skills.map(skill => <span key={skill} className="skill-tag">{skill}</span>)}</div>}
                    </div>
                    {app.motivationLetter && (
                      <div className="motivation">
                        <h4>Lettre de motivation:</h4>
                        <p>{app.motivationLetter}</p>
                      </div>
                    )}
                    <div className="application-actions">
                      <p>Postulé le: {new Date(app.createdAt).toLocaleDateString()}</p>
                      <div className="status-buttons">
                        <button onClick={() => handleUpdateStatus(app._id, 'accepted')} className="btn-success" disabled={app.status === 'accepted'}>Accepter</button>
                        <button onClick={() => handleUpdateStatus(app._id, 'rejected')} className="btn-danger" disabled={app.status === 'rejected'}>Refuser</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CompanyDashboard;
