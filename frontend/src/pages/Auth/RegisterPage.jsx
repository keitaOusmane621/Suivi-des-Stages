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
      setError(err.response?.data?.message || 'Erreur lors de l’inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Créer un compte</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type de compte</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="student">Étudiant</option>
              <option value="company">Entreprise</option>
            </select>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="votre@email.com" required />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Minimum 6 caractères" required />
          </div>

          {formData.role === 'student' && (
            <>
              <div className="form-group">
                <label>Prénom</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Votre prénom" required />
              </div>
              <div className="form-group">
                <label>Nom</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Votre nom" required />
              </div>
            </>
          )}

          {formData.role === 'company' && (
            <>
              <div className="form-group">
                <label>Nom de l'entreprise</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nom de votre entreprise" required />
              </div>
              <div className="form-group">
                <label>Secteur d'activité</label>
                <input type="text" name="sector" value={formData.sector} onChange={handleChange} placeholder="Secteur d'activité" required />
              </div>
            </>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Création...' : 'Créer le compte'}
          </button>
        </form>

        <p className="auth-link">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
