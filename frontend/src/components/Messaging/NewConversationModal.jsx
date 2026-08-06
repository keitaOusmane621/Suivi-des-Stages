// src/components/Messaging/NewConversationModal.jsx
import React, { useState } from 'react';
import './Messaging.css';

const NewConversationModal = ({ isOpen, onClose, onStartConversation, currentUser, contacts }) => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [initialMessage, setInitialMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedContact) {
      onStartConversation(selectedContact, initialMessage);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Nouvelle conversation</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="search-section">
            <input
              type="text"
              className="contact-search"
              placeholder="Rechercher un contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="contacts-list">
            {filteredContacts.map(contact => (
              <div
                key={contact.id}
                className={`contact-item ${selectedContact?.id === contact.id ? 'selected' : ''}`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="contact-avatar">
                  {contact.avatar || contact.name.charAt(0)}
                </div>
                <div className="contact-info">
                  <h4>{contact.name}</h4>
                  <p className="contact-role">
                    {contact.role === 'student' ? 'Étudiant' : 
                     contact.role === 'company' ? 'Entreprise' : 
                     contact.role === 'admin' ? 'Support' : 'Utilisateur'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {selectedContact && (
            <form onSubmit={handleSubmit} className="message-form">
              <textarea
                className="initial-message"
                placeholder={`Message à ${selectedContact.name}...`}
                value={initialMessage}
                onChange={(e) => setInitialMessage(e.target.value)}
                rows="3"
              />
              
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={onClose}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary" disabled={!initialMessage.trim()}>
                  Démarrer la conversation
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewConversationModal;