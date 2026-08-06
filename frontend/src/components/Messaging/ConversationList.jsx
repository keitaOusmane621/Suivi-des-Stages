// src/components/Messaging/ConversationList.jsx
import React, { useState } from 'react';
import ConversationItem from './ConversationItem';
import './Messaging.css';

const ConversationList = ({ 
  conversations, 
  selectedConversation, 
  onSelectConversation,
  currentUserId,
  onSearch 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="conversation-list">
      <div className="conversation-header">
        <h3 className="conversation-title">Messages</h3>
        <div className="conversation-actions">
          <button className="new-conversation-btn" title="Nouvelle conversation">
            +
          </button>
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher une conversation..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <span className="search-icon">🔍</span>
      </div>

      <div className="conversation-items">
        {conversations.length === 0 ? (
          <div className="empty-conversations">
            <p>Aucune conversation</p>
            <p className="empty-hint">Commencez une nouvelle conversation !</p>
          </div>
        ) : (
          conversations.map(conversation => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedConversation?.id === conversation.id}
              onClick={() => onSelectConversation(conversation)}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;