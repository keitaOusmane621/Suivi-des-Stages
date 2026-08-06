import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import './Auth.css';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const emailInputRef = useRef(null);

  // États
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Focus sur l'email au chargement
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // Compte à rebours pour redirection
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && success) {
      // Redirection automatique après 3 secondes
      navigate('/login', { state: { message: 'Un lien de réinitialisation vous a été envoyé par email.' } });
    }
    return () => clearTimeout(timer);
  }, [countdown, success, navigate]);

  // Validation en temps réel
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      setErrors((prev) => ({ ...prev, email: 'Veuillez entrer une adresse email valide.' }));
    } else {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  // Soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccess('');
    setErrors({});

    // Validation
    let hasError = false;
    if (!email) {
      setErrors({ email: 'L\'email est requis.' });
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: 'Format d\'email invalide.' });
      hasError = true;
    }

    if (hasError) {
      // Secouer le formulaire
      const card = document.querySelector('.auth-card');
      card.classList.add('shake');
      setTimeout(() => card.classList.remove('shake'), 500);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccess(response.data?.message || 'Un email de réinitialisation a été envoyé à votre adresse.');
      setCountdown(3); // Redirection après 3 secondes
    } catch (error) {
      const msg = error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.';
      setApiError(msg);
      // Secouer
      const card = document.querySelector('.auth-card');
      card.classList.add('shake');
      setTimeout(() => card.classList.remove('shake'), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page forgot-password-page">
      {/* Navigation */}
      <nav className="auth-nav">
        <div className="nav-container">
          <Link to="/" className="logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">StageTrack</span>
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link home-btn">
              <span className="nav-icon">🏠</span> Accueil
            </Link>
            <Link to="/login" className="nav-link">
              <span className="nav-icon">🔐</span> Connexion
            </Link>
          </div>
        </div>
      </nav>

      <div className="auth-container">
        <div className="auth-card">
          {/* En-tête */}
          <div className="auth-header">
            <div className="auth-logo">
              <div className="auth-logo-icon">🎓</div>
              <div className="auth-title">StageTrack</div>
            </div>
            <h2 className="auth-subtitle">Mot de passe oublié</h2>
            <p className="auth-description">
              Entrez votre adresse email pour recevoir un lien de réinitialisation
            </p>
          </div>

          {/* Messages */}
          {apiError && (
            <div className="error-message">
              <span className="error-icon">❌</span> {apiError}
            </div>
          )}
          {success && (
            <div className="success-message">
              <span className="success-icon">✅</span> {success}
              {countdown > 0 && <span className="countdown"> ({countdown}s)</span>}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="email">
                <span className="label-icon">📧</span> Adresse email
              </label>
              <input
                ref={emailInputRef}
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="exemple@domaine.com"
                className={errors.email ? 'input-error' : ''}
                aria-describedby="email-error"
                disabled={loading || success}
                required
              />
              {errors.email && (
                <span id="email-error" className="field-error">{errors.email}</span>
              )}
              <small className="form-help">
                Vous recevrez un lien pour créer un nouveau mot de passe
              </small>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading || success}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Envoi en cours...
                </>
              ) : success ? (
                'Lien envoyé ✓'
              ) : (
                'Envoyer le lien de réinitialisation'
              )}
            </button>
          </form>

          <div className="auth-links-group">
            <Link to="/login" className="auth-link">
              <span className="link-icon">←</span> Retour à la connexion
            </Link>
            <Link to="/register" className="auth-link">
              <span className="link-icon">📝</span> Créer un nouveau compte
            </Link>
          </div>

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

export default ForgotPasswordPage;