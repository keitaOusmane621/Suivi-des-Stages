// src/pages/Auth/ResetPasswordPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import './Auth.css';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: '',
    passwordConfirm: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Vérifier la validité du token au chargement
  useEffect(() => {
    const verifyToken = async () => {
      try {
        await api.get(`/auth/verify-reset-token/${token}`);
        setTokenValid(true);
      } catch (error) {
        setTokenValid(false);
        setApiError('Le lien de réinitialisation est invalide ou a expiré.');
      }
    };
    verifyToken();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validation en temps réel
    if (name === 'password' && value.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: 'Minimum 6 caractères.',
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: '' }));
    }

    if (name === 'passwordConfirm' && value !== formData.password) {
      setErrors((prev) => ({
        ...prev,
        passwordConfirm: 'Les mots de passe ne correspondent pas.',
      }));
    } else {
      setErrors((prev) => ({ ...prev, passwordConfirm: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setErrors({});

    // Validation
    let hasError = false;
    if (!formData.password || formData.password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: 'Minimum 6 caractères.',
      }));
      hasError = true;
    }
    if (formData.password !== formData.passwordConfirm) {
      setErrors((prev) => ({
        ...prev,
        passwordConfirm: 'Les mots de passe ne correspondent pas.',
      }));
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, {
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
      });
      setSuccess(true);
      toast.success('Mot de passe réinitialisé avec succès !');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setApiError(
        error.response?.data?.message ||
          'Erreur lors de la réinitialisation du mot de passe.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h2>Vérification du lien...</h2>
              <div className="spinner"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h2>🔒 Lien invalide</h2>
              <p className="auth-description">
                Le lien de réinitialisation est invalide ou a expiré.
              </p>
            </div>
            <Link to="/forgot-password" className="btn-primary">
              Demander un nouveau lien
            </Link>
            <div className="auth-footer">
              <Link to="/login">← Retour à la connexion</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <nav className="auth-nav">
        <div className="nav-container">
          <Link to="/" className="logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">StageTrack</span>
          </Link>
        </div>
      </nav>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <div className="auth-logo-icon">🔐</div>
              <div className="auth-title">Nouveau mot de passe</div>
            </div>
            <h2 className="auth-subtitle">Réinitialisation</h2>
            <p className="auth-description">
              Choisissez un nouveau mot de passe sécurisé.
            </p>
          </div>

          {apiError && (
            <div className="error-message">
              <span className="error-icon">❌</span> {apiError}
            </div>
          )}
          {success && (
            <div className="success-message">
              <span className="success-icon">✅</span> Mot de passe réinitialisé
              avec succès ! Redirection...
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="password">Nouveau mot de passe</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 caractères"
                  className={errors.password ? 'input-error' : ''}
                  disabled={success}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="passwordConfirm">Confirmer le mot de passe</label>
              <input
                type="password"
                id="passwordConfirm"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="Confirmez votre mot de passe"
                className={errors.passwordConfirm ? 'input-error' : ''}
                disabled={success}
                required
              />
              {errors.passwordConfirm && (
                <span className="field-error">{errors.passwordConfirm}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading || success}
            >
              {loading ? 'En cours...' : 'Réinitialiser le mot de passe'}
            </button>
          </form>

          <div className="auth-footer">
            <Link to="/login">← Retour à la connexion</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;