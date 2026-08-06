import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import './Auth.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const emailInputRef = useRef(null);

  // État du formulaire
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student',
    firstName: '',
    lastName: '',
    name: '',
    sector: '',
  });

  // États de gestion
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0); // 0-4
  const [successMessage, setSuccessMessage] = useState('');

  // Focus sur l'email au chargement
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // Gestion des changements avec validation en temps réel
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validation en temps réel
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        setErrors((prev) => ({ ...prev, email: 'Veuillez entrer une adresse email valide.' }));
      } else {
        setErrors((prev) => ({ ...prev, email: '' }));
      }
    }
    if (name === 'password') {
      // Évaluer la force du mot de passe
      let strength = 0;
      if (value.length >= 6) strength++;
      if (value.length >= 10) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(Math.min(strength, 4));

      if (value && value.length < 6) {
        setErrors((prev) => ({ ...prev, password: 'Le mot de passe doit contenir au moins 6 caractères.' }));
      } else {
        setErrors((prev) => ({ ...prev, password: '' }));
      }
    }
    if (name === 'firstName' || name === 'lastName') {
      if (value && value.trim().length < 2) {
        setErrors((prev) => ({ ...prev, [name]: 'Minimum 2 caractères.' }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }
    if (name === 'name' || name === 'sector') {
      if (value && value.trim().length < 2) {
        setErrors((prev) => ({ ...prev, [name]: 'Minimum 2 caractères.' }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }
  };

  // Gestion du changement de rôle (on réinitialise les champs spécifiques)
  const handleRoleChange = (e) => {
    const role = e.target.value;
    setFormData((prev) => ({
      ...prev,
      role,
      // On peut réinitialiser les champs de l'autre rôle pour éviter les confusions
      firstName: role === 'student' ? prev.firstName : '',
      lastName: role === 'student' ? prev.lastName : '',
      name: role === 'company' ? prev.name : '',
      sector: role === 'company' ? prev.sector : '',
    }));
    // On efface les erreurs de ces champs
    setErrors((prev) => ({
      ...prev,
      firstName: '',
      lastName: '',
      name: '',
      sector: '',
    }));
  };

  // Toggle affichage mot de passe
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setErrors({});

    // Validation finale complète
    let hasError = false;
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'L\'email est requis.';
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide.';
      hasError = true;
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis.';
      hasError = true;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 caractères.';
      hasError = true;
    }

    if (formData.role === 'student') {
      if (!formData.firstName || formData.firstName.trim().length < 2) {
        newErrors.firstName = 'Prénom requis (minimum 2 caractères).';
        hasError = true;
      }
      if (!formData.lastName || formData.lastName.trim().length < 2) {
        newErrors.lastName = 'Nom requis (minimum 2 caractères).';
        hasError = true;
      }
    } else if (formData.role === 'company') {
      if (!formData.name || formData.name.trim().length < 2) {
        newErrors.name = 'Nom de l\'entreprise requis (minimum 2 caractères).';
        hasError = true;
      }
      if (!formData.sector || formData.sector.trim().length < 2) {
        newErrors.sector = 'Secteur d\'activité requis (minimum 2 caractères).';
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      // Secouer le formulaire
      const card = document.querySelector('.auth-card');
      card.classList.add('shake');
      setTimeout(() => card.classList.remove('shake'), 500);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/register', formData);
      setSuccessMessage('✅ Compte créé avec succès ! Vous allez être redirigé vers la connexion.');
      // Redirection après 2 secondes
      setTimeout(() => {
        navigate('/login', { state: { message: 'Inscription réussie ! Connectez-vous.' } });
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur lors de l\'inscription. Veuillez réessayer.';
      setApiError(msg);
      // Secouer
      const card = document.querySelector('.auth-card');
      card.classList.add('shake');
      setTimeout(() => card.classList.remove('shake'), 500);
    } finally {
      setLoading(false);
    }
  };

  // Rendu de la barre de force du mot de passe
  const renderPasswordStrength = () => {
    if (!formData.password) return null;
    const labels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
    const colors = ['#ef4444', '#f59e0b', '#f59e0b', '#22c55e', '#22c55e'];
    return (
      <div className="password-strength">
        <div className="strength-bar">
          <div
            className="strength-fill"
            style={{
              width: `${(passwordStrength / 4) * 100}%`,
              background: colors[passwordStrength] || '#e2e8f0',
            }}
          />
        </div>
        <span className="strength-label" style={{ color: colors[passwordStrength] || '#e2e8f0' }}>
          {labels[passwordStrength] || ''}
        </span>
      </div>
    );
  };

  return (
    <div className="auth-page register-page">
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
              <span className="nav-icon">🔑</span> Connexion
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
            <h2 className="auth-subtitle">Inscription</h2>
            <p className="auth-description">Rejoignez notre communauté grandissante</p>
          </div>

          {/* Message de succès */}
          {successMessage && (
            <div className="success-message">
              <span className="success-icon">✅</span> {successMessage}
            </div>
          )}

          {/* Erreur API */}
          {apiError && (
            <div className="error-message">
              <span className="error-icon">❌</span> {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Type de compte */}
            <div className="form-group">
              <label htmlFor="role">
                <span className="label-icon">👤</span> Type de compte
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleRoleChange}
                className={errors.role ? 'input-error' : ''}
                disabled={loading}
              >
                <option value="student">🎓 Étudiant</option>
                <option value="company">🏢 Entreprise</option>
              </select>
              {errors.role && <span className="field-error">{errors.role}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">
                <span className="label-icon">📧</span> Email
              </label>
              <input
                ref={emailInputRef}
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                className={errors.email ? 'input-error' : ''}
                aria-describedby="email-error"
                disabled={loading}
                required
              />
              {errors.email && (
                <span id="email-error" className="field-error">{errors.email}</span>
              )}
            </div>

            {/* Mot de passe */}
            <div className="form-group">
              <label htmlFor="password">
                <span className="label-icon">🔒</span> Mot de passe
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 caractères"
                  className={errors.password ? 'input-error' : ''}
                  aria-describedby="password-error"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <span id="password-error" className="field-error">{errors.password}</span>
              )}
              {renderPasswordStrength()}
            </div>

            {/* Champs spécifiques : Étudiant */}
            {formData.role === 'student' && (
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="firstName">
                    <span className="label-icon">👤</span> Prénom
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Votre prénom"
                    className={errors.firstName ? 'input-error' : ''}
                    disabled={loading}
                    required
                  />
                  {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">
                    <span className="label-icon">👤</span> Nom
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    className={errors.lastName ? 'input-error' : ''}
                    disabled={loading}
                    required
                  />
                  {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                </div>
              </div>
            )}

            {/* Champs spécifiques : Entreprise */}
            {formData.role === 'company' && (
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">
                    <span className="label-icon">🏢</span> Nom de l'entreprise
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nom de votre entreprise"
                    className={errors.name ? 'input-error' : ''}
                    disabled={loading}
                    required
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="sector">
                    <span className="label-icon">📊</span> Secteur d'activité
                  </label>
                  <input
                    type="text"
                    id="sector"
                    name="sector"
                    value={formData.sector}
                    onChange={handleChange}
                    placeholder="Ex: Informatique, Santé, ..."
                    className={errors.sector ? 'input-error' : ''}
                    disabled={loading}
                    required
                  />
                  {errors.sector && <span className="field-error">{errors.sector}</span>}
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span> Création en cours...
                </>
              ) : (
                'Créer le compte'
              )}
            </button>
          </form>

          <p className="auth-link">
            Déjà un compte ? <Link to="/login" className="link-highlight">Se connecter</Link>
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

export default RegisterPage;
