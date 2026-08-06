import React from 'react';
import './MessageBubble.css';

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`message-bubble ${isOwn ? 'own' : 'other'}`}>
      <div className="message-content">
        <p>{message.text}</p>
        <span className="message-time">
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
      {message.status === 'read' && <span className="read-status">✓✓</span>}
    </div>
  );
};