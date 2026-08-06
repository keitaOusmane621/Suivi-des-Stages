const express = require('express');
const router = express.Router();
const messagingController = require('../controllers/messagingController');
const messageController = require('../controllers/messageController');
const { validate } = require('../utils/validation');
const { messageSchemas } = require('../utils/validation');

// Routes pour les conversations
router.get('/conversations', messagingController.getConversations);
router.post('/conversations/start', validate(messageSchemas.startConversation), messagingController.startConversation);
router.get('/conversations/:conversationId/messages', messagingController.getMessages);
router.put('/conversations/:conversationId/read', messagingController.markConversationAsRead);
router.delete('/conversations/:conversationId', messagingController.deleteConversation);

// Routes pour les messages
router.post('/messages/send', validate(messageSchemas.sendMessage), messagingController.sendMessage);
router.get('/messages/search', messagingController.searchMessages);
router.put('/messages/:messageId/react', validate(messageSchemas.reactToMessage), messageController.reactToMessage);
router.delete('/messages/:messageId', messageController.deleteMessage);

// Routes pour les statistiques et compteurs
router.get('/unread-count', messagingController.getUnreadCount);
router.get('/stats', messageController.getMessagingStats);

// Route pour rechercher des utilisateurs
router.get('/users/search', messagingController.searchUsers);

module.exports = router;