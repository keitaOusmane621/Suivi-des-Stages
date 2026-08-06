import React from 'react';

const FeatureCard = ({ icon, title, description, stat }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
    <div className="feature-stat">{stat}</div>
  </div>
);

export default FeatureCard;