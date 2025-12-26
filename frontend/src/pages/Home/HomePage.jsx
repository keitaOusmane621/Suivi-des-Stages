import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const images = [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80"
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [images.length]);

  const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Merci ! Vous recevrez les dernières offres à ${email}`);
      setEmail('');
    }
  };

  return (
    <div className="homepage">
      {/* Navigation */}
      <nav className="home-nav">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">StageTrack</span>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link active">
              <span className="nav-icon">🏠</span>
              Accueil
            </Link>
            <Link to="/about" className="nav-link">
              <span className="nav-icon">ℹ️</span>
              À propos
            </Link>
            <Link to="/login" className="nav-link">
              <span className="nav-icon">🔑</span>
              Connexion
            </Link>
            <Link to="/register" className="nav-link register-btn">
              <span className="nav-icon">📝</span>
              Inscription
            </Link>
            <button onClick={toggleDarkMode} className="nav-link darkmode-btn">
              <span className="nav-icon">🌙</span>
              Mode Sombre
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section avec slider */}
      <section className="hero">
        <div className="hero-slider">
          {images.map((src, index) => (
            <div
              key={index}
              className={`slide ${index === currentImage ? 'active' : ''}`}
              style={{ backgroundImage: `url(${src})` }}
            ></div>
          ))}
        </div>

        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-line">Bienvenue sur</span>
            <span className="title-line highlight">StageTrack</span>
          </h1>

          <p className="typing-text">
            La plateforme qui connecte <span className="typewriter">les étudiants aux meilleures opportunités de stage</span>
          </p>

          <p className="hero-description">
            Découvrez des offres de stage personnalisées, postulez en un clic, 
            et gérez vos candidatures en temps réel. Que vous soyez étudiant 
            recherchant une opportunité ou entreprise cherchant des talents, 
            StageTrack simplifie votre processus.
          </p>

          <div className="hero-buttons">
            <Link to="/register?role=student" className="btn btn-primary">
              🎯 Je suis étudiant
            </Link>
            <Link to="/register?role=company" className="btn btn-primary">
              🏢 Je suis entreprise
            </Link>
          </div>
        </div>
      </section>

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
      <section className="features-section">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Rapide et Efficient</h3>
            <p className="feature-description">
              Processus de candidature simplifié et gestion centralisée
            </p>
            <div className="feature-stat">90% plus rapide</div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Ciblage Intelligent</h3>
            <p className="feature-description">
              Offres personnalisées selon votre profil et compétences
            </p>
            <div className="feature-stat">500+ matchs/mois</div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">Sécurisé et Fiable</h3>
            <p className="feature-description">
              Données protégées et processus de recrutement transparent
            </p>
            <div className="feature-stat">100% sécurisé</div>
          </div>
        </div>
      </section>

      {/* Section: Chiffres clés */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-header">
            <h2 className="stats-title">Chiffres clés</h2>
            <p className="stats-subtitle">Rejoignez notre communauté grandissante</p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Étudiants actifs</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-number">150+</div>
              <div className="stat-label">Entreprises partenaires</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Offres publiées</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-number">85%</div>
              <div className="stat-label">Taux de réussite</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section - Prêt à commencer votre aventure ? */}
      <section className="adventure-cta">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Prêt à commencer votre aventure ?</h2>
            <p className="cta-subtitle">
              Rejoignez des milliers d'étudiants et d'entreprises qui utilisent déjà StageTrack
            </p>
            
            <div className="cta-actions">
              <Link to="/register" className="cta-btn-primary">
                <span className="btn-icon">🚀</span>
                Commencer Gratuitement
              </Link>
              
              <div className="existing-account">
                <span className="checkbox-icon">✓</span>
                <Link to="/login" className="cta-link">
                  J'ai déjà un compte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section - Comme dans la maquette */}
      <footer className="home-footer">
        <div className="footer-container">
          {/* Section principale du footer */}
          <div className="footer-main">
            {/* Colonne StageTrack */}
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
              
              {/* Contact */}
              <div className="contact-section">
                <h4 className="contact-title">
                  <span className="contact-icon">📞</span>
                  Contact
                </h4>
                <div className="contact-info">
                  <p className="contact-item">
                    <span className="contact-icon-small">📍</span>
                    l'Innovation, Conakry, Guinée
                  </p>
                  <p className="contact-item">
                    <span className="contact-icon-small">📱</span>
                    +224 621-51-98-97
                  </p>
                  <p className="contact-item">
                    <span className="contact-icon-small">✉️</span>
                    contact@stagetrack.com
                  </p>
                </div>
              </div>
              
              {/* Newsletter */}
              <div className="newsletter-section">
                <h4 className="newsletter-title">
                  <span className="newsletter-icon">📧</span>
                  Recevez les dernières offres
                </h4>
                <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre email"
                    className="newsletter-input"
                    required
                  />
                  <button type="submit" className="newsletter-btn">
                    S'abonner
                  </button>
                </form>
              </div>
            </div>

            {/* Colonne Liens rapides */}
            <div className="footer-column">
              <h4 className="footer-column-title">Liens rapides</h4>
              <ul className="footer-links">
                <li><Link to="/" className="footer-link">Accueil</Link></li>
                <li><Link to="/offers" className="footer-link">Offres de stage</Link></li>
                <li><Link to="/about" className="footer-link">À propos</Link></li>
                <li><Link to="/contact" className="footer-link">Contact</Link></li>
              </ul>
            </div>

            {/* Colonne Pour les étudiants */}
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

            {/* Colonne Pour les employeurs */}
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

          {/* Footer Bottom */}
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