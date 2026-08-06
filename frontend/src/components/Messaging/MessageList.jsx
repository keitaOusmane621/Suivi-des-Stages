// src/components/Messaging/MessageList.jsx
import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import './Messaging.css';

const MessageList = ({ messages, currentUserId, conversation }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!conversation) {
    return (
      <div className="no-conversation-selected">
        <div className="empty-state">
          <span className="empty-icon">💬</span>
          <h3>Sélectionnez une conversation</h3>
          <p>Choisissez une conversation pour commencer à discuter</p>
        </div>
      </div>
    );
  }

  const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);

  return (
    <div className="message-list">
      <div className="message-list-header">
        <div className="conversation-info">
          <div className="conversation-avatar">
            {otherParticipant.avatar || otherParticipant.name.charAt(0)}
          </div>
          <div>
            <h3 className="conversation-partner">{otherParticipant.name}</h3>
            <p className="conversation-role">{otherParticipant.role === 'student' ? 'Étudiant' : 
                                             otherParticipant.role === 'company' ? 'Entreprise' : 
                                             otherParticipant.role === 'admin' ? 'Support' : 'Utilisateur'}</p>
          </div>
        </div>
        <div className="conversation-actions">
          <button className="action-btn" title="Informations">
            ⓘ
          </button>
          <button className="action-btn" title="Supprimer">
            🗑️
          </button>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>Aucun message dans cette conversation</p>
            <p>Envoyez le premier message !</p>
          </div>
        ) : (
          messages.map(message => (
            <MessageItem
              key={message.id}
              message={message}
              isOwn={message.senderId === currentUserId}
              senderName={otherParticipant.name}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;