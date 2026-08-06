import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './ApplyPage.css';

const ApplyPage = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cv, setCv] = useState(null);
  const [letter, setLetter] = useState(null);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/offers/${offerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Offre introuvable');
        const data = await res.json();
        setOffer(data);
      } catch (err) {
        toast.error('Offre introuvable');
        navigate('/student/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchOffer();
  }, [offerId, navigate]);

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [field]: 'Format non supporté. Utilisez PDF, DOC ou DOCX.',
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [field]: 'Le fichier ne doit pas dépasser 5 Mo.',
        }));
        return;
      }
      setErrors((prev) => ({ ...prev, [field]: null }));
      if (field === 'cv') {
        setCv(file);
        console.log('✅ CV sélectionné :', file.name);
      } else {
        setLetter(file);
        console.log('✅ Lettre sélectionnée :', file.name);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cv) {
      toast.error('Veuillez sélectionner votre CV.');
      return;
    }
    if (!letter) {
      toast.error('Veuillez sélectionner votre lettre de motivation.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('cv', cv);
      formData.append('motivationLetter', letter);
      formData.append('message', message);

      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/applications/offers/${offerId}/apply`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const responseText = await response.text();
      console.log('📥 Réponse brute du serveur :', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        data = { message: responseText };
      }

      if (!response.ok) {
        // ✅ Afficher le message d'erreur exact du backend
        const errorMessage = data.message || 'Erreur inconnue';
        console.error('❌ Erreur backend :', errorMessage);

        // ✅ Gestion spécifique du cas "déjà postulé"
        if (
          response.status === 400 &&
          (errorMessage.includes('déjà postulé') || errorMessage.includes('duplication'))
        ) {
          setAlreadyApplied(true);
          toast('📌 Vous avez déjà postulé à cette offre.', { duration: 5000, icon: 'ℹ️' });
          return;
        }

        // Autres erreurs
        if (response.status === 401) {
          toast.error('Session expirée, veuillez vous reconnecter.');
          navigate('/login');
          return;
        }
        toast.error(errorMessage || 'Erreur lors de la candidature.');
        return;
      }

      toast.success('Candidature envoyée avec succès !');
      navigate('/student/dashboard');
    } catch (err) {
      console.error('❌ Erreur réseau :', err);
      toast.error('Impossible de contacter le serveur.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="apply-loading">Chargement...</div>;
  if (!offer) return <div className="apply-error">Offre non disponible.</div>;

  return (
    <div className="apply-page">
      <div className="apply-container">
        <h1>Postuler à : {offer.title}</h1>

        {alreadyApplied ? (
          <div className="already-applied-card">
            <div className="already-applied-icon">✅</div>
            <h2>Vous avez déjà postulé à cette offre</h2>
            <p>Votre candidature a bien été enregistrée.</p>
            <div className="already-applied-actions">
              <Link to="/student/dashboard" className="btn-primary">
                📋 Voir mes candidatures
              </Link>
              <Link to="/offers" className="btn-secondary">
                🔍 Explorer d'autres offres
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="offer-summary">
              <p>
                <strong>Entreprise :</strong> {offer.companyId?.name || 'Non spécifié'}
              </p>
              <p>
                <strong>Lieu :</strong> {offer.location}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="apply-form">
              <div className="form-group">
                <label htmlFor="cv">CV (PDF, DOC, DOCX) *</label>
                <input
                  type="file"
                  id="cv"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, 'cv')}
                />
                {errors.cv && <span className="error-message">{errors.cv}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="motivationLetter">
                  Lettre de motivation (PDF, DOC, DOCX) *
                </label>
                <input
                  type="file"
                  id="motivationLetter"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, 'motivationLetter')}
                />
                {errors.motivationLetter && (
                  <span className="error-message">{errors.motivationLetter}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="message">Message personnalisé (optionnel)</label>
                <textarea
                  id="message"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ajoutez un message pour l'entreprise..."
                />
              </div>
              <button type="submit" className="btn-submit" disabled={submitting}>
                {submitting ? 'Envoi en cours...' : '📤 Envoyer ma candidature'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ApplyPage;