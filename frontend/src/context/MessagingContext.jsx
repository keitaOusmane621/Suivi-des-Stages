import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const MessagingContext = createContext();

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within MessagingProvider');
  }
  return context;
};

export const MessagingProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [currentContact, setCurrentContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadConversations = useCallback(async () => {
    try {
      console.log('📥 Chargement des conversations...');
      const res = await api.get('/messages/conversations');
      console.log('✅ Conversations chargées:', res.data);
      setConversations(res.data);
      const totalUnread = res.data.reduce((acc, conv) => acc + conv.unreadCount, 0);
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error('❌ Erreur loadConversations:', error);
      console.error('Détails:', error.response?.data);
      toast.error('Impossible de charger les conversations');
    }
  }, []);

  const loadMessages = useCallback(async (contactId) => {
    setLoading(true);
    try {
      console.log(`📥 Chargement des messages avec ${contactId}...`);
      const res = await api.get(`/messages/${contactId}`);
      console.log(`✅ ${res.data.length} messages chargés`);
      setMessages(res.data);
      await loadConversations();
      return res.data;
    } catch (error) {
      console.error('❌ Erreur loadMessages:', error);
      toast.error('Impossible de charger les messages');
    } finally {
      setLoading(false);
    }
  }, [loadConversations]);

  const sendMessage = useCallback(async (recipientId, content) => {
    if (!content.trim()) return;
    try {
      const res = await api.post('/messages/send', { recipientId, content });
      const newMessage = res.data;
      setMessages((prev) => [...prev, newMessage]);
      await loadConversations();
      return newMessage;
    } catch (error) {
      console.error('❌ Erreur sendMessage:', error);
      toast.error('Impossible d\'envoyer le message');
      throw error;
    }
  }, [loadConversations]);

  const markAsRead = useCallback(async (messageId) => {
    try {
      await api.put(`/messages/${messageId}/read`);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, read: true, readAt: new Date() } : msg
        )
      );
      await loadConversations();
    } catch (error) {
      console.error('❌ Erreur markAsRead:', error);
    }
  }, [loadConversations]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await api.get('/messages/unread-count');
      setUnreadCount(res.data.count);
    } catch (error) {
      console.error('❌ Erreur fetchUnreadCount:', error);
    }
  }, []);

  useEffect(() => {
    loadConversations();
    fetchUnreadCount();
    const interval = setInterval(() => {
      loadConversations();
      fetchUnreadCount();
    }, 15000);
    return () => clearInterval(interval);
  }, [loadConversations, fetchUnreadCount]);

  const value = {
    conversations,
    currentContact,
    setCurrentContact,
    messages,
    loading,
    unreadCount,
    loadConversations,
    loadMessages,
    sendMessage,
    markAsRead,
    fetchUnreadCount,
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};