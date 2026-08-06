import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const OffersTable = ({ offers, onOfferAction }) => {
  const [filter, setFilter] = useState('all');
  const filtered = offers.filter(o => filter === 'all' ? true : filter === 'active' ? o.active : !o.active);

  return (
    <section className="offers-section">
      <div className="section-header">
        <h2>💼 Gestion des offres</h2>
        <p>Gérez les offres de stage</p>
      </div>
      <div className="table-container">
        <div className="table-header">
          <div className="table-title"><span className="table-count">{filtered.length} offres</span></div>
          <div className="table-filters">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Toutes</button>
            <button className={`filter-btn ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Actives</button>
            <button className={`filter-btn ${filter === 'inactive' ? 'active' : ''}`} onClick={() => setFilter('inactive')}>Inactives</button>
          </div>
        </div>
        <table className="offers-table">
          <thead>
            <tr><th>Titre</th><th>Entreprise</th><th>Lieu</th><th>Durée</th><th>Statut</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o._id}>
                <td><div className="offer-title"><strong>{o.title}</strong></div></td>
                <td>{o.companyId?.name || 'N/A'}</td>
                <td><span className="location-badge">📍 {o.location}</span></td>
                <td>{o.duration}</td>
                <td><span className={`status-badge ${o.active ? 'active' : 'inactive'}`}><span className="status-dot"></span>{o.active ? 'Active' : 'Inactive'}</span></td>
                <td>{new Date(o.createdAt).toLocaleDateString('fr-FR')}</td>
                <td>
                  <div className="action-buttons">
                    {o.active ? (
                      <button onClick={() => onOfferAction(o._id, 'deactivate')} className="btn-warning">⏸️ Désactiver</button>
                    ) : (
                      <button onClick={() => onOfferAction(o._id, 'activate')} className="btn-success">▶️ Activer</button>
                    )}
                    <button className="btn-info">👁️ Voir</button>
                    <Link to={`/messaging?company=${o.companyId?._id}`} className="btn-info">💬</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default OffersTable;