import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Dashboard.css';

const StudentDashboard = () => {
  const [offers, setOffers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('offers');
  
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

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Dashboard Étudiant</h1>
        <div className="user-info">
          <span>Bienvenue, {user?.email}</span>
          <button onClick={handleLogout} className="btn-logout">Déconnexion</button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="dashboard-nav">
        <button className={selectedTab === 'offers' ? 'active' : ''} onClick={() => setSelectedTab('offers')}>
          Offres de stage ({offers.length})
        </button>
        <button className={selectedTab === 'applications' ? 'active' : ''} onClick={() => setSelectedTab('applications')}>
          Mes candidatures ({applications.length})
        </button>
      </nav>

      {/* Content */}
      <main className="dashboard-content">
        {selectedTab === 'offers' && (
          <div className="offers-grid">
            <h2>Offres de stage disponibles</h2>
            {offers.length === 0 ? <p>Aucune offre disponible pour le moment.</p> : (
              offers.map(offer => (
                <div key={offer._id} className="offer-card">
                  <h3>{offer.title}</h3>
                  <p className="company">{offer.companyId?.name || 'Entreprise'}</p>
                  <p className="location">{offer.location}</p>
                  <p className="duration">{offer.duration}</p>
                  <p className="description">{offer.description}</p>
                  <div className="skills">
                    {offer.skillsRequired?.map(skill => <span key={skill} className="skill-tag">{skill}</span>)}
                  </div>
                  <button className="btn-primary" onClick={() => handleApply(offer._id)}>Postuler</button>
                </div>
              ))
            )}
          </div>
        )}

        {selectedTab === 'applications' && (
          <div className="applications-grid">
            <h2>Mes candidatures</h2>
            {applications.length === 0 ? <p>Vous n'avez encore postulé à aucune offre.</p> : (
              applications.map(app => (
                <div key={app._id} className="application-card">
                  <div className="application-header">
                    <h3>{app.offerId?.title}</h3>
                    <span className={`status ${app.status}`}>{app.status}</span>
                  </div>
                  <p className="company">{app.offerId?.companyId?.name}</p>
                  <p className="date">Postulé le: {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
