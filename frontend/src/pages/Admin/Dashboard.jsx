// ================================================================
// ADMIN DASHBOARD - Version Professionnelle
// ================================================================
// Technologies : React 18+, Recharts, React Hot Toast, Hooks personnalisés
// ================================================================

import React, { useState, useEffect, useReducer, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import api from '../../services/api';
import './AdminDashboard.css';

// ---------- Composants internes (découpage) ----------
import DashboardHeader from './DashboardHeader';
import NotificationBell from './NotificationBell';
import StatisticsCards from './StatisticsCards';
import StatisticsChart from './StatisticsChart';
import UsersTable from './UsersTable';
import OffersTable from './OffersTable';
import LoadingSpinner from "../../components/common/LoadingSpinner";

// ---------- Réducer pour gérer l'état du tableau de bord ----------
const initialState = {
  stats: { totalStudents: 0, totalCompanies: 0, totalOffers: 0, totalApplications: 0 },
  users: [],
  offers: [],
  loading: true,
  error: null,
  unreadMessages: 0,
  selectedTab: 'stats',
  isDarkMode: false,
};

function dashboardReducer(state, action) {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, ...action.payload, loading: false, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_TAB':
      return { ...state, selectedTab: action.payload };
    case 'SET_UNREAD_MESSAGES':
      return { ...state, unreadMessages: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, isDarkMode: !state.isDarkMode };
    default:
      return state;
  }
}

// ================================================================
// COMPOSANT PRINCIPAL
// ================================================================
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const user = JSON.parse(localStorage.getItem('user'));

  // ---------- Récupération des données ----------
  const fetchDashboardData = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const [statsRes, usersRes, offersRes] = await Promise.all([
        api.get('/admin/dashboard-stats'),
        api.get('/admin/users'),
        api.get('/offers')
      ]);
      dispatch({
        type: 'SET_DATA',
        payload: {
          stats: statsRes.data,
          users: usersRes.data,
          offers: offersRes.data,
        }
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Erreur de chargement' });
      toast.error('Impossible de charger les données');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  }, [navigate]);

  // ---------- Récupération des messages non lus (avec polling) ----------
  const fetchUnreadMessages = useCallback(async () => {
    try {
      // Simule un appel API ; à remplacer par un vrai appel
      const mockUnread = Math.floor(Math.random() * 5);
      // const response = await api.get('/messages/unread-count');
      dispatch({ type: 'SET_UNREAD_MESSAGES', payload: mockUnread });
    } catch (err) {
      console.error('Erreur messages non lus:', err);
    }
  }, []);

  // ---------- Effet au montage ----------
  useEffect(() => {
    fetchDashboardData();
    fetchUnreadMessages();
    const interval = setInterval(fetchUnreadMessages, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData, fetchUnreadMessages]);

  // ---------- Handlers ----------
  const handleUserAction = async (userId, action) => {
    try {
      await api.put(`/admin/users/${userId}`, { action });
      const actionLabel = action === 'disable' ? 'désactivé' : action === 'enable' ? 'activé' : 'supprimé';
      toast.success(`Utilisateur ${actionLabel} avec succès`);
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action impossible');
    }
  };

  const handleOfferAction = async (offerId, action) => {
    try {
      await api.put(`/admin/offers/${offerId}`, { action });
      const actionLabel = action === 'deactivate' ? 'désactivée' : 'activée';
      toast.success(`Offre ${actionLabel} avec succès`);
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action impossible');
    }
  };

  const handleTabChange = (tab) => dispatch({ type: 'SET_TAB', payload: tab });
  const toggleTheme = () => dispatch({ type: 'TOGGLE_THEME' });
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Déconnexion réussie');
  };

  // ---------- Données préparées pour les graphiques ----------
  const chartData = useMemo(() => [
    { name: 'Étudiants', value: state.stats.totalStudents || 0 },
    { name: 'Entreprises', value: state.stats.totalCompanies || 0 },
    { name: 'Offres', value: state.stats.totalOffers || 0 },
    { name: 'Candidatures', value: state.stats.totalApplications || 0 },
  ], [state.stats]);

  // ---------- Rendu ----------
  if (state.loading) {
    return (
      <div className="admin-loading">
        <LoadingSpinner />
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="admin-error">
        <h3>⚠️ Une erreur est survenue</h3>
        <p>{state.error}</p>
        <button onClick={fetchDashboardData} className="btn-retry">Réessayer</button>
      </div>
    );
  }

  return (
    <div className={`admin-dashboard ${state.isDarkMode ? 'dark-theme' : ''}`}>
      <Toaster position="top-right" />
      
      {/* En-tête avec notifications et thème */}
      <DashboardHeader
        user={user}
        unreadMessages={state.unreadMessages}
        onLogout={handleLogout}
        onToggleTheme={toggleTheme}
        isDarkMode={state.isDarkMode}
      />

      {/* Navigation par onglets */}
      <nav className="dashboard-nav">
        <button
          className={`nav-tab ${state.selectedTab === 'stats' ? 'active' : ''}`}
          onClick={() => handleTabChange('stats')}
        >
          <span className="tab-icon">📊</span> Statistiques
        </button>
        <button
          className={`nav-tab ${state.selectedTab === 'users' ? 'active' : ''}`}
          onClick={() => handleTabChange('users')}
        >
          <span className="tab-icon">👥</span> Utilisateurs
          <span className="tab-badge">{state.users.length}</span>
        </button>
        <button
          className={`nav-tab ${state.selectedTab === 'offers' ? 'active' : ''}`}
          onClick={() => handleTabChange('offers')}
        >
          <span className="tab-icon">💼</span> Offres
          <span className="tab-badge">{state.offers.length}</span>
        </button>
        <button
          className={`nav-tab ${state.selectedTab === 'messages' ? 'active' : ''}`}
          onClick={() => navigate('/messaging')}
        >
          <span className="tab-icon">💬</span> Messages
          {state.unreadMessages > 0 && (
            <span className="tab-badge notification">{state.unreadMessages}</span>
          )}
        </button>
      </nav>

      {/* Contenu principal */}
      <main className="dashboard-content">
        {state.selectedTab === 'stats' && (
          <>
            <section className="stats-overview">
              <header className="section-header">
                <h2>📈 Vue d'ensemble de la plateforme</h2>
                <p>Statistiques en temps réel et tendances</p>
              </header>
              
              {/* Cartes statistiques */}
              <StatisticsCards stats={state.stats} unreadMessages={state.unreadMessages} />

              {/* Graphiques modernes avec Recharts */}
              <div className="charts-grid">
                <div className="chart-card">
                  <h3>Répartition des entités</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#4f46e5', '#06b6d4', '#f59e0b', '#ef4444'][index % 4]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-card">
                  <h3>Évolution mensuelle (simulée)</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={[
                      { mois: 'Jan', étudiants: 20, offres: 8 },
                      { mois: 'Fév', étudiants: 28, offres: 12 },
                      { mois: 'Mar', étudiants: 35, offres: 15 },
                      { mois: 'Avr', étudiants: 42, offres: 22 },
                      { mois: 'Mai', étudiants: 55, offres: 30 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mois" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="étudiants" stroke="#4f46e5" />
                      <Line type="monotone" dataKey="offres" stroke="#f59e0b" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>
          </>
        )}

        {state.selectedTab === 'users' && (
          <UsersTable
            users={state.users}
            onUserAction={handleUserAction}
            onRefresh={fetchDashboardData}
          />
        )}

        {state.selectedTab === 'offers' && (
          <OffersTable
            offers={state.offers}
            onOfferAction={handleOfferAction}
            onRefresh={fetchDashboardData}
          />
        )}
      </main>

      <footer className="dashboard-footer">
        <p>© 2025 StageTrack Admin — Tous droits réservés</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;