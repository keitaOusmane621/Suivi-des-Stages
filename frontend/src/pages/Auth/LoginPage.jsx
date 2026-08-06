import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../../services/api';
import './Auth.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailInputRef = useRef(null);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
    if (emailInputRef.current) emailInputRef.current.focus();
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        setErrors((prev) => ({ ...prev, email: 'Veuillez entrer une adresse email valide.' }));
      } else {
        setErrors((prev) => ({ ...prev, email: '' }));
      }
    }
    if (name === 'password') {
      if (value && value.length < 6) {
        setErrors((prev) => ({ ...prev, password: 'Minimum 6 caractères.' }));
      } else {
        setErrors((prev) => ({ ...prev, password: '' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setErrors({});

    let hasError = false;
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "L'email est requis." }));
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Format d'email invalide." }));
      hasError = true;
    }
    if (!formData.password) {
      setErrors((prev) => ({ ...prev, password: 'Le mot de passe est requis.' }));
      hasError = true;
    } else if (formData.password.length < 6) {
      setErrors((prev) => ({ ...prev, password: 'Minimum 6 caractères.' }));
      hasError = true;
    }

    if (hasError) {
      const card = document.querySelector('.auth-card');
      card.classList.add('shake');
      setTimeout(() => card.classList.remove('shake'), 500);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      console.log('✅ Réponse complète du backend:', response.data);

      // Extraction correcte du token et de l'utilisateur
      const { token, data } = response.data;
      const user = data.user;
      console.log('👤 Utilisateur extrait:', user);

      if (!user || !user.role) {
        throw new Error('Rôle utilisateur manquant dans la réponse');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Redirection selon le rôle
      const dashboardPath = `/${user.role}/dashboard`;
      console.log(`🔀 Redirection vers: ${dashboardPath}`);
      navigate(dashboardPath);
    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error);
      const msg = error.response?.data?.message || error.message || 'Erreur de connexion. Veuillez réessayer.';
      setApiError(msg);
      const card = document.querySelector('.auth-card');
      card.classList.add('shake');
      setTimeout(() => card.classList.remove('shake'), 500);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  useEffect(() => {
    const remembered = localStorage.getItem('rememberedEmail');
    if (remembered) {
      setFormData((prev) => ({ ...prev, email: remembered }));
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="login-page">
      <nav className="auth-nav">
        <div className="nav-container">
          <Link to="/" className="logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">StageTrack</span>
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link home-btn">🏠 Accueil</Link>
            <Link to="/register" className="nav-link register-btn">📝 Inscription</Link>
          </div>
        </div>
      </nav>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <div className="auth-logo-icon">🎓</div>
              <div className="auth-title">StageTrack</div>
            </div>
            <h2 className="auth-subtitle">Connexion</h2>
            <p className="auth-description">Accédez à votre compte pour gérer vos stages</p>
          </div>

          {successMessage && (
            <div className="success-message">✅ {successMessage}</div>
          )}
          {apiError && (
            <div className="error-message">❌ {apiError}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="email">📧 Adresse email</label>
              <input
                ref={emailInputRef}
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="exemple@domaine.com"
                className={errors.email ? 'input-error' : ''}
                disabled={loading}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">🔒 Mot de passe</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={errors.password ? 'input-error' : ''}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                Se souvenir de moi
              </label>
              <Link to="/forgot-password" className="forgot-password">Mot de passe oublié ?</Link>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <p className="auth-link">
            Pas encore de compte ? <Link to="/register" className="link-highlight">Créer un compte</Link>
          </p>
          <div className="auth-footer">
            <Link to="/" className="link-highlight">← Retour à l'accueil</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;