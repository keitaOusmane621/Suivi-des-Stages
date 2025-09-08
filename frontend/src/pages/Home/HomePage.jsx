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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [images.length]);

  // Fonction toggle dark mode
  const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");
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
            <Link to="/login" className="nav-link">Connexion</Link>
            <Link to="/register" className="nav-link register-btn">Inscription</Link>
            <button onClick={toggleDarkMode} className="nav-link darkmode-btn">
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
            <Link to="/register?role=company" className="btn btn-secondary">
              🏢 Je suis entreprise
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h2>Pourquoi choisir StageTrack ?</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Rapide et Efficient</h3>
              <p>Processus de candidature simplifié et gestion centralisée</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Ciblage Intelligent</h3>
              <p>Offres personnalisées selon votre profil et compétences</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Sécurisé et Fiable</h3>
              <p>Données protégées et processus de recrutement transparent</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Étudiants actifs</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">150+</span>
            <span className="stat-label">Entreprises partenaires</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Offres publiées</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">85%</span>
            <span className="stat-label">Taux de réussite</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>StageTrack</h4>
              <p>La plateforme de référence pour les stages étudiants</p>
            </div>
            
            <div className="footer-section">
              <h4>Liens rapides</h4>
              <Link to="/login">Connexion</Link>
              <Link to="/register">Inscription</Link>
            </div>
            
            <div className="footer-section">
              <h4>Contact</h4>
              <p>contact@stagetrack.fr</p>
              <p>+224 621 51 98 97</p>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 StageTrack. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
