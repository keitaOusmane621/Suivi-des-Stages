// src/services/messagingService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Service de messagerie
export const messagingService = {
  // Récupérer toutes les conversations de l'utilisateur
  async getConversations(userId) {
    try {
      const response = await axios.get(`${API_URL}/messages/conversations/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  // Récupérer les messages d'une conversation
  async getMessages(conversationId) {
    try {
      const response = await axios.get(`${API_URL}/messages/conversation/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Envoyer un message
  async sendMessage(messageData) {
    try {
      const response = await axios.post(`${API_URL}/messages/send`, messageData);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Démarrer une nouvelle conversation
  async startConversation(participants, initialMessage = null) {
    try {
      const response = await axios.post(`${API_URL}/messages/conversation/start`, {
        participants,
        initialMessage
      });
      return response.data;
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  },

  // Marquer les messages comme lus
  async markAsRead(conversationId, userId) {
    try {
      const response = await axios.put(`${API_URL}/messages/mark-read`, {
        conversationId,
        userId
      });
      return response.data;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },

  // Supprimer une conversation
  async deleteConversation(conversationId) {
    try {
      const response = await axios.delete(`${API_URL}/messages/conversation/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  },

  // Rechercher des conversations
  async searchConversations(query, userId) {
    try {
      const response = await axios.get(`${API_URL}/messages/search`, {
        params: { query, userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching conversations:', error);
      throw error;
    }
  },

  // Obtenir les notifications de messages non lus
  async getUnreadCount(userId) {
    try {
      const response = await axios.get(`${API_URL}/messages/unread/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  // Simulation de données pour le développement
  getMockConversations(userId) {
    return [
      {
        id: '1',
        participants: [
          { id: '1', name: 'Mamadou Diallo', role: 'student', avatar: 'MD' },
          { id: userId, name: 'Vous', role: 'company', avatar: 'VO' }
        ],
        lastMessage: {
          text: 'Je suis intéressé par votre offre de stage',
          senderId: '1',
          timestamp: '2024-03-15T14:30:00Z',
          read: true
        },
        unreadCount: 0,
        updatedAt: '2024-03-15T14:30:00Z'
      },
      {
        id: '2',
        participants: [
          { id: '2', name: 'TechCorp Guinée', role: 'company', avatar: 'TC' },
          { id: userId, name: 'Vous', role: 'student', avatar: 'VO' }
        ],
        lastMessage: {
          text: 'Nous vous proposons un entretien mercredi prochain',
          senderId: '2',
          timestamp: '2024-03-14T10:15:00Z',
          read: false
        },
        unreadCount: 2,
        updatedAt: '2024-03-14T10:15:00Z'
      },
      {
        id: '3',
        participants: [
          { id: '3', name: 'Aïcha Bah', role: 'student', avatar: 'AB' },
          { id: userId, name: 'Vous', role: 'company', avatar: 'VO' }
        ],
        lastMessage: {
          text: 'Merci pour votre réponse rapide !',
          senderId: userId,
          timestamp: '2024-03-13T16:45:00Z',
          read: true
        },
        unreadCount: 0,
        updatedAt: '2024-03-13T16:45:00Z'
      },
      {
        id: '4',
        participants: [
          { id: '4', name: 'Support StageTrack', role: 'admin', avatar: 'ST' },
          { id: userId, name: 'Vous', role: 'student', avatar: 'VO' }
        ],
        lastMessage: {
          text: 'Comment puis-je vous aider aujourd\'hui ?',
          senderId: '4',
          timestamp: '2024-03-12T09:20:00Z',
          read: true
        },
        unreadCount: 0,
        updatedAt: '2024-03-12T09:20:00Z'
      }
    ];
  },

  getMockMessages(conversationId) {
    const messages = {
      '1': [
        {
          id: '1',
          text: 'Bonjour, je suis intéressé par votre offre de stage en développement web.',
          senderId: '1',
          timestamp: '2024-03-15T14:30:00Z',
          read: true
        },
        {
          id: '2',
          text: 'Bonjour Mamadou, merci pour votre intérêt. Pouvez-vous m\'envoyer votre CV ?',
          senderId: 'user',
          timestamp: '2024-03-15T14:45:00Z',
          read: true
        },
        {
          id: '3',
          text: 'Je viens de l\'envoyer par email. L\'avez-vous reçu ?',
          senderId: '1',
          timestamp: '2024-03-15T15:00:00Z',
          read: true
        }
      ],
      '2': [
        {
          id: '4',
          text: 'Votre candidature pour le stage en marketing digital a été présélectionnée.',
          senderId: '2',
          timestamp: '2024-03-14T10:15:00Z',
          read: false
        },
        {
          id: '5',
          text: 'Nous aimerions vous rencontrer pour un entretien la semaine prochaine.',
          senderId: '2',
          timestamp: '2024-03-14T10:16:00Z',
          read: false
        }
      ]
    };
    
    return messages[conversationId] || [];
  }
};