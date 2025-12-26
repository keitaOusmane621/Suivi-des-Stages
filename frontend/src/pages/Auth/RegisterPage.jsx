import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import './Auth.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student',
    firstName: '',
    lastName: '',
    name: '',
    sector: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', formData);
      alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Navigation */}
      <nav className="auth-nav">
        <div className="nav-container">
          <Link to="/" className="logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">StageTrack</span>
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link home-btn">
              <span className="nav-icon">🏠</span>
              Accueil
            </Link>
            <Link to="/login" className="nav-link">
              <span className="nav-icon">🔑</span>
              Connexion
            </Link>
          </div>
        </div>
      </nav>

      <div className="auth-card">
        {/* Logo de la plateforme en haut */}
        <div className="auth-header">
          <div className="auth-logo">
            <div className="auth-logo-icon">🎓</div>
            <div className="auth-title">StageTrack</div>
          </div>
          <h2 className="auth-subtitle">Inscription</h2>
          <p className="auth-description">Rejoignez notre communauté grandissante</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type de compte</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange} 
              required
            >
              <option value="student">Étudiant</option>
              <option value="company">Entreprise</option>
            </select>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="votre@email.com" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Minimum 6 caractères" 
              required 
            />
          </div>

          {formData.role === 'student' && (
            <div className="form-grid">
              <div className="form-group">
                <label>Prénom</label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  placeholder="Votre prénom" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Nom</label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  placeholder="Votre nom" 
                  required 
                />
              </div>
            </div>
          )}

          {formData.role === 'company' && (
            <div className="form-grid">
              <div className="form-group">
                <label>Nom de l'entreprise</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Nom de votre entreprise" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Secteur d'activité</label>
                <input 
                  type="text" 
                  name="sector" 
                  value={formData.sector} 
                  onChange={handleChange} 
                  placeholder="Secteur d'activité" 
                  required 
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
          >
            {loading ? 'Création...' : 'Créer le compte'}
          </button>
        </form>

        <p className="auth-link">
          Déjà un compte ? <Link to="/login" className="link-highlight">Se connecter</Link>
        </p>

        {/* Retour à l'accueil en bas */}
        <div className="auth-footer">
          <Link to="/" className="link-highlight">
            &larr; Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
