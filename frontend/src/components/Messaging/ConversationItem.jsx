// src/components/Messaging/ConversationItem.jsx
import React from 'react';
import './Messaging.css';

const ConversationItem = ({ conversation, isSelected, onClick, currentUserId }) => {
  const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
  const lastMessage = conversation.lastMessage;
  const isUnread = conversation.unreadCount > 0;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 86400000) { // Moins de 24h
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  };

  const truncateText = (text, maxLength = 40) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div 
      className={`conversation-item ${isSelected ? 'selected' : ''} ${isUnread ? 'unread' : ''}`}
      onClick={onClick}
    >
      <div className="conversation-avatar">
        {otherParticipant.avatar || otherParticipant.name.charAt(0)}
      </div>
      
      <div className="conversation-content">
        <div className="conversation-header">
          <h4 className="conversation-name">{otherParticipant.name}</h4>
          {lastMessage && (
            <span className="conversation-time">
              {formatTime(lastMessage.timestamp)}
            </span>
          )}
        </div>
        
        {lastMessage && (
          <p className="conversation-preview">
            {truncateText(lastMessage.text)}
          </p>
        )}
        
        {isUnread && (
          <div className="unread-badge">
            {conversation.unreadCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationItem;