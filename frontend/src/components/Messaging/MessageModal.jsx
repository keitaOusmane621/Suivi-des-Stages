import React, { useState } from 'react';
import api from '../../services/api';
import './MessageModal.css';

const MessageModal = ({ isOpen, onClose, receiverId, receiverName }) => {
  const [message, setMessage] = useState({
    subject: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/messages/send', {
        receiverId,
        subject: message.subject,
        content: message.content
      });
      
      alert('Message envoyé avec succès !');
      setMessage({ subject: '', content: '' });
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Envoyer un message à {receiverName}</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Sujet</label>
            <input
              type="text"
              value={message.subject}
              onChange={(e) => setMessage({...message, subject: e.target.value})}
              required
              placeholder="Sujet du message"
            />
          </div>
          
          <div className="form-group">
            <label>Message</label>
            <textarea
              value={message.content}
              onChange={(e) => setMessage({...message, content: e.target.value})}
              required
              rows="5"
              placeholder="Votre message..."
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Annuler
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Envoi...' : 'Envoyer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageModal;