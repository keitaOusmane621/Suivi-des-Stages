import React, { useState } from 'react';
import './NewMessageModal.css';

const NewMessageModal = ({ onClose, onSend }) => {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Logique de recherche d'utilisateurs

  return (
    <div className="modal-overlay">
      <div className="new-message-modal">
        <div className="modal-header">
          <h3>Nouveau message</h3>
          <button onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <input
            type="text"
            placeholder="Rechercher un contact..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          
          <textarea
            placeholder="Votre message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
          />
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose}>Annuler</button>
          <button 
            onClick={() => onSend({ recipient, message })} 
            disabled={!recipient || !message}
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};