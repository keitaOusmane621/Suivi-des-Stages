import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import './Auth.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Rediriger vers le dashboard selon le rôle
      navigate(`/${userData.role}/dashboard`);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
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
            <Link to="/register" className="nav-link">
              <span className="nav-icon">📝</span>
              Inscription
            </Link>
          </div>
        </div>
      </nav>

      <div className="auth-container">
        <div className="auth-card">
          {/* Logo et titre - Même design que RegisterPage */}
          <div className="auth-header">
            <div className="auth-logo">
              <div className="auth-logo-icon">🎓</div>
              <div className="auth-title">StageTrack</div>
            </div>
            <h2 className="auth-subtitle">Connexion</h2>
            <p className="auth-description">
              Connectez-vous pour accéder à votre compte
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Adresse email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="exemple@post.com"
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
                placeholder="Votre mot de passe"
                required
              />
            </div>

            <div className="form-options">
              <Link to="/forgot-password" className="forgot-password">
                Mot de passe oublié ?
              </Link>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <p className="auth-link">
            Pas encore de compte ? <Link to="/register" className="link-highlight">Créer un compte</Link>
          </p>

          <div className="auth-footer">
            <Link to="/" className="link-highlight">
              &larr; Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;