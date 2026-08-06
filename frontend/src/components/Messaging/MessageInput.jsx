// src/components/Messaging/MessageInput.jsx
import React, { useState } from 'react';
import './Messaging.css';

const MessageInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="message-input-container" onSubmit={handleSubmit}>
      <div className="message-input-wrapper">
        <textarea
          className="message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tapez votre message ici..."
          rows="1"
          disabled={disabled}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!message.trim() || disabled}
        >
          <span className="send-icon">➤</span>
        </button>
      </div>
      
      <div className="input-actions">
        <button type="button" className="action-button" title="Joindre un fichier">
          📎
        </button>
        <button type="button" className="action-button" title="Émoticônes">
          😊
        </button>
      </div>
    </form>
  );
};

export default MessageInput;