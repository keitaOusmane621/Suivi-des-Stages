
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

// Composants internes
import HeroSlider from '../../components/home/HeroSlider';
import FeatureCard from '../../components/home/FeatureCard';
import StatCounter from '../../components/home/StatCounter';
import NewsletterForm from '../../components/home/NewsletterForm';

// Hooks personnalisés
import useDarkMode from '../../hooks/useDarkMode';
import useScrollAnimation from '../../hooks/useScrollAnimation';

// Données (peuvent être externalisées)
const FEATURES = [
  {
    id: 1,
    icon: '⚡',
    title: 'Rapide et Efficient',
    description: 'Processus de candidature simplifié et gestion centralisée',
    stat: '90% plus rapide',
  },
  {
    id: 2,
    icon: '🎯',
    title: 'Ciblage Intelligent',
    description: 'Offres personnalisées selon votre profil et compétences',
    stat: '500+ matchs/mois',
  },
  {
    id: 3,
    icon: '🔒',
    title: 'Sécurisé et Fiable',
    description: 'Données protégées et processus de recrutement transparent',
    stat: '100% sécurisé',
  },
];

const STATS = [
  { id: 1, value: 500, label: 'Étudiants actifs', suffix: '+' },
  { id: 2, value: 150, label: 'Entreprises partenaires', suffix: '+' },
  { id: 3, value: 1000, label: 'Offres publiées', suffix: '+' },
  { id: 4, value: 85, label: 'Taux de réussite', suffix: '%' },
];

const HomePage = () => {
  const [isDark, toggleDark] = useDarkMode(); // Hook personnalisé
  const [email, setEmail] = useState('');

  // Gestion de l'affichage du menu mobile
  const [menuOpen, setMenuOpen] = useState(false);

  // Références pour les animations au scroll
  const featuresRef = useRef(null);
  const statsRef = useRef(null);

  useScrollAnimation(featuresRef);
  useScrollAnimation(statsRef);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Merci ! Vous recevrez les dernières offres à ${email}`);
      setEmail('');
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className={`homepage ${isDark ? 'dark-mode' : ''}`}>
      {/* Navigation */}
      <nav className="home-nav" role="navigation" aria-label="Navigation principale">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">StageTrack</span>
          </div>

          {/* Bouton hamburger pour mobile */}
          <button
            className="nav-hamburger"
            onClick={toggleMenu}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>

          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>
              <span className="nav-icon">ℹ️</span> À propos
            </Link>
            <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
              <span className="nav-icon">🔑</span> Connexion
            </Link>
            <Link to="/register" className="nav-link register-btn" onClick={() => setMenuOpen(false)}>
              <span className="nav-icon">📝</span> Inscription
            </Link>
            <button className="nav-link darkmode-btn" onClick={toggleDark}>
              <span className="nav-icon">{isDark ? '☀️' : '🌙'}</span>
              {isDark ? 'Mode Clair' : 'Mode Sombre'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section avec slider */}
      <HeroSlider />

      {/* Section: Pourquoi choisir StageTrack ? */}
      <section className="why-section">
        <div className="why-container">
          <h2 className="why-title">Pourquoi choisir StageTrack ?</h2>
          <h3 className="why-subtitle">Tout ce dont vous avez besoin pour réussir</h3>
          <p className="why-description">
            Une plateforme complète qui simplifie votre recherche de stage
          </p>
        </div>
      </section>

      {/* Section: Fonctionnalités */}
      <section className="features-section" ref={featuresRef}>
        <div className="features-container">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.id} {...feature} />
          ))}
        </div>
      </section>

      {/* Section: Chiffres clés */}
      <section className="stats-section" ref={statsRef}>
        <div className="stats-container">
          <div className="stats-header">
            <h2 className="stats-title">Chiffres clés</h2>
            <p className="stats-subtitle">Rejoignez notre communauté grandissante</p>
          </div>
          <div className="stats-grid">
            {STATS.map((stat) => (
              <StatCounter key={stat.id} value={stat.value} label={stat.label} suffix={stat.suffix} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="adventure-cta">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Prêt à commencer votre aventure ?</h2>
            <p className="cta-subtitle">
              Rejoignez des milliers d'étudiants et d'entreprises qui utilisent déjà StageTrack
            </p>
            <div className="cta-actions">
              <Link to="/register" className="cta-btn-primary">
                <span className="btn-icon">🚀</span> Commencer Gratuitement
              </Link>
              <div className="existing-account">
                <span className="checkbox-icon">✓</span>
                <Link to="/login" className="cta-link">J'ai déjà un compte</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer" role="contentinfo">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-column">
              <div className="footer-logo-section">
                <div className="footer-logo">
                  <span className="footer-logo-icon">🎓</span>
                  <span className="footer-logo-text">StageTrack</span>
                </div>
                <p className="footer-description">
                  La plateforme de référence pour trouver et proposer des stages de qualité.
                  Connecte les étudiants aux entreprises innovantes.
                </p>
              </div>
              <div className="contact-section">
                <h4 className="contact-title">📞 Contact</h4>
                <div className="contact-info">
                  <p className="contact-item">📍 l'Innovation, Conakry, Guinée</p>
                  <p className="contact-item">📱 +224 621-51-98-97</p>
                  <p className="contact-item">✉️ contact@stagetrack.com</p>
                </div>
              </div>
              <div className="newsletter-section">
                <h4 className="newsletter-title">📧 Recevez les dernières offres</h4>
                <NewsletterForm
                  email={email}
                  setEmail={setEmail}
                  onSubmit={handleNewsletterSubmit}
                />
              </div>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Liens rapides</h4>
              <ul className="footer-links">
                <li><Link to="/" className="footer-link">Accueil</Link></li>
                <li><Link to="/offers" className="footer-link">Offres de stage</Link></li>
                <li><Link to="/about" className="footer-link">À propos</Link></li>
                <li><Link to="/contact" className="footer-link">Contact</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Pour les étudiants</h4>
              <ul className="footer-links">
                <li><Link to="/register?role=student" className="footer-link">Créer un compte étudiant</Link></li>
                <li><Link to="/offers" className="footer-link">Trouver un stage</Link></li>
                <li><Link to="/resources" className="footer-link">Ressources CV</Link></li>
                <li><Link to="/guides" className="footer-link">Guides d'entretien</Link></li>
                <li><Link to="/testimonials" className="footer-link">Témoignages</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Pour les employeurs</h4>
              <ul className="footer-links">
                <li><Link to="/register?role=company" className="footer-link">Créer un compte employeur</Link></li>
                <li><Link to="/company/offers" className="footer-link">Publier une offre</Link></li>
                <li><Link to="/pricing" className="footer-link">Tarifs</Link></li>
                <li><Link to="/success-stories" className="footer-link">Réussites</Link></li>
                <li><Link to="/employer-support" className="footer-link">Support employeurs</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-divider"></div>
            <div className="bottom-content">
              <p className="copyright">
                © 2025 StageTrack. Tous droits réservés,
                <Link to="/privacy" className="privacy-link"> politique de confidentialité</Link>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;