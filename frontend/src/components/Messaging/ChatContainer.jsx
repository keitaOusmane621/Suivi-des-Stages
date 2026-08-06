import React from 'react';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useMessaging } from '../../context/MessagingContext';
import './Messaging.css';

const ChatContainer = ({ currentUser }) => {
  const {
    conversations,
    selectedConversation,
    messages,
    loading,
    selectConversation,
    sendMessage,
    searchConversations
  } = useMessaging();

  if (loading) {
    return (
      <div className="chat-container loading">
        <div className="loading-spinner">💬</div>
        <p>Chargement des messages...</p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-layout">
        <div className="sidebar">
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={selectConversation}
            currentUserId={currentUser.id}
            onSearch={searchConversations}
          />
        </div>
        
        <div className="main-chat">
          <MessageList
            messages={messages}
            currentUserId={currentUser.id}
            conversation={selectedConversation}
          />
          
          {selectedConversation && (
            <MessageInput
              onSend={sendMessage}
              disabled={!selectedConversation}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;