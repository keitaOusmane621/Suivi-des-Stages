import React, { useState, useEffect, useRef } from 'react';
import './MessagingPanel.css';
import ConversationList from './ConversationList';
import ChatArea from './ChatArea';
import NewMessageModal from './NewMessageModal';

const MessagingPanel = ({ 
  isOpen, 
  onClose, 
  currentUserId, 
  userRole 
}) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Logique de récupération des conversations et messages
  // Gestion de l'envoi de messages
  // Socket pour les messages en temps réel

  return (
    <div className={`messaging-panel-overlay ${isOpen ? 'open' : ''}`}>
      <div className="messaging-panel">
        {/* En-tête */}
        <div className="messaging-header">
          <h3>Messagerie</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        {/* Corps */}
        <div className="messaging-body">
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
            onNewMessage={() => setShowNewMessageModal(true)}
          />
          
          <ChatArea
            conversation={selectedConversation}
            messages={messages}
            newMessageText={newMessageText}
            onMessageChange={setNewMessageText}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>

      {showNewMessageModal && (
        <NewMessageModal
          onClose={() => setShowNewMessageModal(false)}
          onSend={handleNewMessage}
        />
      )}
    </div>
  );
};

export default MessagingPanel;