import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMessaging } from '../../context/MessagingContext';
import './MessagingPage.css';

const MessagingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const {
    conversations,
    currentContact,
    setCurrentContact,
    messages,
    loading,
    loadMessages,
    sendMessage,
    markAsRead,
  } = useMessaging();

  const [newMessage, setNewMessage] = useState('');
  const [selectedContactId, setSelectedContactId] = useState(null);
  const messagesEndRef = useRef(null);

  // Gérer la sélection depuis l'URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const contactId = params.get('user') || params.get('company') || params.get('student');
    if (contactId) {
      setSelectedContactId(contactId);
      const contact = conversations.find(c => c.user._id === contactId);
      if (contact) {
        setCurrentContact(contact.user);
      } else {
        // Si le contact n'est pas dans la liste, on le crée temporairement
        setCurrentContact({ _id: contactId, firstName: 'Utilisateur', lastName: '' });
      }
      loadMessages(contactId);
    }
  }, [location.search, conversations, setCurrentContact, loadMessages]);

  // Marquer comme lus
  useEffect(() => {
    if (messages.length > 0 && currentContact) {
      const unreadMessages = messages.filter(
        (msg) => msg.recipient._id === user?._id && !msg.read
      );
      unreadMessages.forEach((msg) => markAsRead(msg._id));
    }
  }, [messages, currentContact, user, markAsRead]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSelectContact = (conversation) => {
    setSelectedContactId(conversation.user._id);
    setCurrentContact(conversation.user);
    loadMessages(conversation.user._id);
    navigate(`/messaging?user=${conversation.user._id}`);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentContact) return;
    try {
      await sendMessage(currentContact._id, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      // déjà géré
    }
  };

  return (
    <div className="messaging-page">
      {/* Liste des conversations */}
      <div className="conversation-list">
        <div className="conversation-header">
          <h3>💬 Messages</h3>
          <span className="conversation-count">{conversations.length}</span>
        </div>
        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Chargement...</p>
          </div>
        )}
        {conversations.length === 0 && !loading && (
          <div className="empty-conversations">
            <div className="empty-icon">📭</div>
            <p>Aucune conversation</p>
            <span className="empty-hint">Envoyez un message à un étudiant ou une entreprise</span>
          </div>
        )}
        {conversations.map((conv) => (
          <div
            key={conv.user._id}
            className={`conversation-item ${selectedContactId === conv.user._id ? 'active' : ''}`}
            onClick={() => handleSelectContact(conv)}
          >
            <div className="avatar-wrapper">
              <div className="avatar">
                {conv.user.firstName?.[0] || 'U'}
              </div>
              {conv.unreadCount > 0 && <span className="online-dot"></span>}
            </div>
            <div className="conversation-info">
              <div className="name">
                {conv.user.firstName} {conv.user.lastName}
                <span className="user-role">({conv.user.role})</span>
              </div>
              <div className="last-message">
                {conv.lastMessage?.content || 'Nouveau message'}
              </div>
            </div>
            <div className="conversation-meta">
              {conv.lastMessage && (
                <span className="message-time">
                  {new Date(conv.lastMessage.createdAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </span>
              )}
              {conv.unreadCount > 0 && (
                <span className="unread-badge">{conv.unreadCount}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Zone de messages */}
      <div className="message-area">
        {currentContact ? (
          <>
            <div className="message-header">
              <div className="contact-info">
                <div className="contact-avatar">
                  {currentContact.firstName?.[0] || 'U'}
                </div>
                <div className="contact-details">
                  <span className="contact-name">
                    {currentContact.firstName} {currentContact.lastName}
                  </span>
                  <span className="contact-email">{currentContact.email}</span>
                  <span className="contact-role">{currentContact.role}</span>
                </div>
              </div>
            </div>
            <div className="messages-container">
              {messages.length === 0 && (
                <div className="no-messages">
                  <div className="no-messages-icon">💬</div>
                  <p>Aucun message</p>
                  <span>Envoyez votre premier message</span>
                </div>
              )}
              {messages.map((msg) => {
                const isMine = msg.sender?._id === user?._id;
                return (
                  <div
                    key={msg._id}
                    className={`message ${isMine ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">{msg.content}</div>
                    <div className="message-time">
                      {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {isMine && msg.read && <span className="read-status">✓✓</span>}
                      {isMine && !msg.read && <span className="read-status">✓</span>}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="message-input-form">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="message-input"
              />
              <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
                <span className="send-icon">✉️</span> Envoyer
              </button>
            </form>
          </>
        ) : (
          <div className="no-conversation-selected">
            <div className="empty-state-icon">💬</div>
            <h3>Bienvenue dans votre messagerie</h3>
            <p>Sélectionnez une conversation pour commencer à discuter</p>
            <span className="empty-hint">ou envoyez un message depuis une offre ou une candidature</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingPage;