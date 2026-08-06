import React from 'react';

const NewsletterForm = ({ email, setEmail, onSubmit }) => (
  <form onSubmit={onSubmit} className="newsletter-form">
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="votre email"
      className="newsletter-input"
      required
      aria-label="Adresse email pour la newsletter"
    />
    <button type="submit" className="newsletter-btn">S'abonner</button>
  </form>
);

export default NewsletterForm;