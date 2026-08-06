import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const images = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80"
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      <div className="hero-slider">
        {images.map((src, index) => (
          <div
            key={index}
            className={`slide ${index === current ? 'active' : ''}`}
            style={{ backgroundImage: `url(${src})` }}
            aria-hidden={index !== current}
          />
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
        
      </div>
    </section>
  );
};

export default HeroSlider;