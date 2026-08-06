import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UsersTable = ({ users, onUserAction }) => {
  const [filter, setFilter] = useState('all');
  const filtered = users.filter(u => filter === 'all' ? true : u.role === filter);

  return (
    <section className="users-section">
      <div className="section-header">
        <h2>👥 Gestion des utilisateurs</h2>
        <p>Gérez les comptes étudiants et entreprises</p>
      </div>
      <div className="table-container">
        <div className="table-header">
          <div className="table-title">
            <span className="table-count">{filtered.length} utilisateurs</span>
          </div>
          <div className="table-filters">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Tous</button>
            <button className={`filter-btn ${filter === 'student' ? 'active' : ''}`} onClick={() => setFilter('student')}>Étudiants</button>
            <button className={`filter-btn ${filter === 'company' ? 'active' : ''}`} onClick={() => setFilter('company')}>Entreprises</button>
          </div>
        </div>
        <table className="users-table">
          <thead>
            <tr><th>Email</th><th>Rôle</th><th>Statut</th><th>Inscription</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u._id}>
                <td><div className="user-cell"><span className="user-avatar-small">👤</span><span className="user-email">{u.email}</span></div></td>
                <td><span className={`role-badge ${u.role}`}>{u.role === 'student' ? 'Étudiant' : 'Entreprise'}</span></td>
                <td><span className={`status-badge ${u.active ? 'active' : 'inactive'}`}><span className="status-dot"></span>{u.active ? 'Actif' : 'Inactif'}</span></td>
                <td>{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                <td>
                  <div className="action-buttons">
                    {u.active ? (
                      <button onClick={() => onUserAction(u._id, 'disable')} className="btn-warning">⏸️ Suspendre</button>
                    ) : (
                      <button onClick={() => onUserAction(u._id, 'enable')} className="btn-success">▶️ Activer</button>
                    )}
                    <button onClick={() => onUserAction(u._id, 'delete')} className="btn-danger">🗑️ Supprimer</button>
                    <Link to={`/messaging?user=${u._id}`} className="btn-info">💬</Link>
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

export default UsersTable;