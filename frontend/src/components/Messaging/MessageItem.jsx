// src/components/Messaging/MessageItem.jsx
import React from 'react';
import './Messaging.css';

const MessageItem = ({ message, isOwn, senderName }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`message-item ${isOwn ? 'own' : 'other'}`}>
      {!isOwn && (
        <div className="message-sender">
          {senderName}
        </div>
      )}
      
      <div className="message-bubble">
        <p className="message-text">{message.text}</p>
        <span className="message-time">
          {formatTime(message.timestamp)}
          {message.read && isOwn && <span className="read-status">✓✓</span>}
        </span>
      </div>
    </div>
  );
};

export default MessageItem;