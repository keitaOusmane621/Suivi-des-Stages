// AboutPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="homepage">
      {/* Navigation identique à la page d'accueil */}
      <nav className="home-nav">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">StageTrack</span>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">
              <span className="nav-icon">🏠</span>
              Accueil
            </Link>
            <Link to="/about" className="nav-link active">
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
          </div>
        </div>
      </nav>

      {/* Hero Section À propos */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">
            <span className="about-title-line">À propos de</span>
            <span className="about-title-line highlight">StageTrack</span>
          </h1>
          <p className="about-hero-subtitle">
            Connecter la future génération de talents avec les opportunités qui façonnent l'avenir
          </p>
          <div className="about-hero-stats">
            <div className="about-stat">
              <div className="about-stat-number">1000+</div>
              <div className="about-stat-label">Étudiants placés</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-number">85%</div>
              <div className="about-stat-label">Taux de satisfaction</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-number">150+</div>
              <div className="about-stat-label">Entreprises partenaires</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Notre Mission */}
      <section className="about-section mission-section">
        <div className="about-container">
          <div className="about-section-header">
            <h2 className="about-section-title">
              <span className="section-icon">🎯</span>
              Notre Mission
            </h2>
            <p className="about-section-subtitle">
              Révolutionner l'accès aux stages pour les étudiants guinéens
            </p>
          </div>
          
          <div className="mission-content">
            <div className="mission-text">
              <p>
                StageTrack est né d'un constat simple : <strong>trop d'étudiants talentueux en Guinée peinent à trouver des stages de qualité</strong>, 
                tandis que les entreprises cherchent désespérément des compétences fraîches et innovantes.
              </p>
              <p>
                Notre mission est de <strong>créer un pont entre le monde académique et le monde professionnel</strong>, 
                en offrant une plateforme qui simplifie la recherche, l'application et le suivi des stages.
              </p>
              <p>
                Nous croyons fermement que chaque étudiant mérite une opportunité de mettre en pratique ses connaissances, 
                et chaque entreprise mérite d'accéder aux talents de demain.
              </p>
            </div>
            
            <div className="mission-image">
              <div className="mission-image-placeholder">
                <span className="image-icon">🌍</span>
                <p>Étudiants connectés à travers l'Afrique</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Nos Valeurs */}
      <section className="about-section values-section">
        <div className="about-container">
          <div className="about-section-header">
            <h2 className="about-section-title">
              <span className="section-icon">❤️</span>
              Nos Valeurs
            </h2>
            <p className="about-section-subtitle">
              Les principes qui guident chaque décision chez StageTrack
            </p>
          </div>
          
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3 className="value-title">Accessibilité</h3>
              <p className="value-description">
                Nous rendons la recherche de stage accessible à tous les étudiants, 
                quel que soit leur niveau ou leur localisation en Guinée.
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">🎓</div>
              <h3 className="value-title">Excellence académique</h3>
              <p className="value-description">
                Nous favorisons les stages qui contribuent réellement à 
                l'apprentissage et au développement professionnel des étudiants.
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">🏢</div>
              <h3 className="value-title">Partage de valeur</h3>
              <p className="value-description">
                Nous créons des relations gagnant-gagnant où étudiants 
                et entreprises trouvent une réelle valeur ajoutée.
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3 className="value-title">Innovation</h3>
              <p className="value-description">
                Nous utilisons la technologie pour simplifier des processus 
                traditionnellement complexes et inefficaces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section className="about-section how-section">
        <div className="about-container">
          <div className="about-section-header">
            <h2 className="about-section-title">
              <span className="section-icon">🔄</span>
              Comment ça marche ?
            </h2>
            <p className="about-section-subtitle">
              Un processus simplifié pour une expérience optimale
            </p>
          </div>
          
          <div className="how-steps">
            <div className="how-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3 className="step-title">Inscription</h3>
                <p className="step-description">
                  Créez votre profil en 5 minutes, que vous soyez étudiant 
                  ou entreprise. C'est gratuit et sans engagement.
                </p>
              </div>
            </div>
            
            <div className="how-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3 className="step-title">Découverte</h3>
                <p className="step-description">
                  Les étudiants découvrent des offres correspondant à leur profil, 
                  les entreprises trouvent des talents pertinents.
                </p>
              </div>
            </div>
            
            <div className="how-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3 className="step-title">Connexion</h3>
                <p className="step-description">
                  Postulez en un clic ou contactez directement les candidats. 
                  Notre système facilite les premières interactions.
                </p>
              </div>
            </div>
            
            <div className="how-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3 className="step-title">Suivi</h3>
                <p className="step-description">
                  Gérez toutes vos candidatures et offres en temps réel 
                  depuis votre tableau de bord personnalisé.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section L'équipe */}
      <section className="about-section team-section">
        <div className="about-container">
          <div className="about-section-header">
            <h2 className="about-section-title">
              <span className="section-icon">👥</span>
              Notre Équipe
            </h2>
            <p className="about-section-subtitle">
              Des passionnés dédiés à la réussite des étudiants africains
            </p>
          </div>
          
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">
                <span className="avatar-initials">MS</span>
              </div>
              <h3 className="member-name">KEITA Ousmane</h3>
              <p className="member-role">Fondateur & CEO</p>
              <p className="member-description">
                Ancien étudiant en Génie informatique, il a créé StageTrack après avoir 
                personnellement vécu les difficultés de recherche de stage.
              </p>
            </div>
            
            <div className="team-member">
              <div className="member-avatar">
                <span className="avatar-initials">AD</span>
              </div>
              <h3 className="member-name">Aminata Diallo</h3>
              <p className="member-role">Responsable Partenariats</p>
              <p className="member-description">
                4 ans d'expérience dans le recrutement, elle connecte les entreprises 
                avec les talents de demain.
              </p>
            </div>
            
            <div className="team-member">
              <div className="member-avatar">
                <span className="avatar-initials">KT</span>
              </div>
              <h3 className="member-name">Karim Touré</h3>
              <p className="member-role">Lead Développeur</p>
              <p className="member-description">
                Expert en technologies web, il s'assure que la plateforme 
                soit performante et accessible à tous.
              </p>
            </div>
            
            <div className="team-member">
              <div className="member-avatar">
                <span className="avatar-initials">FS</span>
              </div>
              <h3 className="member-name">Fatoumata Sylla</h3>
              <p className="member-role">Responsable Communauté</p>
              <p className="member-description">
                Ancienne étudiante en communication, elle accompagne les étudiants 
                dans leur parcours de recherche de stage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="about-section testimonial-section">
        <div className="about-container">
          <div className="about-section-header">
            <h2 className="about-section-title">
              <span className="section-icon">💬</span>
              Ils nous font confiance
            </h2>
            <p className="about-section-subtitle">
              Ce que disent nos utilisateurs
            </p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <span className="quote-icon">❝</span>
                <p className="testimonial-text">
                  Grâce à StageTrack, j'ai trouvé mon stage de fin d'études 
                  dans une startup innovante. Le processus était simple et rapide !
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">IM</div>
                <div className="author-info">
                  <h4 className="author-name">Ibrahima M.</h4>
                  <p className="author-role">Étudiant en Génie Logiciel</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <span className="quote-icon">❝</span>
                <p className="testimonial-text">
                  En tant qu'entreprise, nous avons trouvé 3 stagiaires 
                  exceptionnels via StageTrack. La plateforme nous fait gagner 
                  un temps précieux.
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">TC</div>
                <div className="author-info">
                  <h4 className="author-name">TechCorp Guinée</h4>
                  <p className="author-role">Entreprise partenaire</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <span className="quote-icon">❝</span>
                <p className="testimonial-text">
                  L'interface intuitive et les offres pertinentes m'ont permis 
                  de trouver un stage aligné avec mes compétences en marketing digital.
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">AB</div>
                <div className="author-info">
                  <h4 className="author-name">Aïcha B.</h4>
                  <p className="author-role">Étudiante en Marketing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="about-cta-content">
          <h2 className="about-cta-title">Prêt à transformer votre recherche de stage ?</h2>
          <p className="about-cta-subtitle">
            Rejoignez la communauté StageTrack et donnez un nouvel élan à votre carrière
          </p>
          <div className="about-cta-buttons">
            <Link to="/register?role=student" className="about-cta-btn primary">
              <span className="btn-icon">🎯</span>
              Commencer en tant qu'étudiant
            </Link>
            <Link to="/register?role=company" className="about-cta-btn secondary">
              <span className="btn-icon">🏢</span>
              Publier des offres en tant qu'entreprise
            </Link>
          </div>
        </div>
      </section>

      {/* Footer identique à la page d'accueil */}
      <footer className="home-footer">
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
                  Connecte les étudiants aux entreprises innovantes en Afrique.
                </p>
              </div>
              
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
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Navigation</h4>
              <ul className="footer-links">
                <li><Link to="/" className="footer-link">Accueil</Link></li>
                <li><Link to="/about" className="footer-link">À propos</Link></li>
                <li><Link to="/offers" className="footer-link">Offres de stage</Link></li>
                <li><Link to="/contact" className="footer-link">Contact</Link></li>
                <li><Link to="/faq" className="footer-link">FAQ</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Ressources</h4>
              <ul className="footer-links">
                <li><Link to="/blog" className="footer-link">Blog & Conseils</Link></li>
                <li><Link to="/guides" className="footer-link">Guides pratiques</Link></li>
                <li><Link to="/cv-templates" className="footer-link">Modèles de CV</Link></li>
                <li><Link to="/interview-tips" className="footer-link">Conseils entretien</Link></li>
                <li><Link to="/success-stories" className="footer-link">Histoires de réussite</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Légal</h4>
              <ul className="footer-links">
                <li><Link to="/privacy" className="footer-link">Politique de confidentialité</Link></li>
                <li><Link to="/terms" className="footer-link">Conditions d'utilisation</Link></li>
                <li><Link to="/cookies" className="footer-link">Politique des cookies</Link></li>
                <li><Link to="/mentions" className="footer-link">Mentions légales</Link></li>
                <li><Link to="/accessibility" className="footer-link">Accessibilité</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-divider"></div>
            <div className="bottom-content">
              <p className="copyright">
                © 2025 StageTrack. Tous droits réservés. Conçu avec ❤️ en Guinée pour les étudiants africains.
              </p>
              <div className="social-links">
                <a href="https://facebook.com/stagetrack" className="social-link">
                  <span className="social-icon">📘</span>
                </a>
                <a href="https://twitter.com/stagetrack" className="social-link">
                  <span className="social-icon">🐦</span>
                </a>
                <a href="https://linkedin.com/company/stagetrack" className="social-link">
                  <span className="social-icon">💼</span>
                </a>
                <a href="https://instagram.com/stagetrack" className="social-link">
                  <span className="social-icon">📸</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;