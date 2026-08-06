import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import './ChatArea.css';

const ChatArea = ({
  conversation,
  messages,
  newMessageText,
  onMessageChange,
  onSendMessage
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-area">
      {conversation ? (
        <>
          <div className="chat-header">
            <div className="chat-partner-info">
              <span className="avatar">{conversation.partner.name[0]}</span>
              <div>
                <h4>{conversation.partner.name}</h4>
                <span className="status">En ligne</span>
              </div>
            </div>
          </div>

          <div className="messages-container">
            {messages.map(message => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUserId}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="message-input">
            <input
              type="text"
              value={newMessageText}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder="Écrivez votre message..."
              onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            />
            <button onClick={onSendMessage} disabled={!newMessageText.trim()}>
              Envoyer
            </button>
          </div>
        </>
      ) : (
        <div className="select-conversation">
          <p>Sélectionnez une conversation</p>
        </div>
      )}
    </div>
  );
};