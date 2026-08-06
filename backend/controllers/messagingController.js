const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const Notification = require('../models/MessageNotification');

class MessagingController {
  // Obtenir toutes les conversations d'un utilisateur
  async getConversations(req, res) {
    try {
      const userId = req.user._id;
      const { page = 1, limit = 20 } = req.query;
      
      const conversations = await Conversation.find({
        'participants.userId': userId,
        isActive: true
      })
      .populate('participants.userId', 'name email avatar role')
      .populate('lastMessage')
      .sort({ lastMessageTime: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

      // Compter les messages non lus
      const unreadCount = await Message.countDocuments({
        'receiver.userId': userId,
        isRead: false
      });

      res.status(200).json({
        success: true,
        conversations,
        unreadCount,
        total: conversations.length,
        page: parseInt(page),
        totalPages: Math.ceil(conversations.length / limit)
      });
    } catch (error) {
      console.error('Error getting conversations:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des conversations'
      });
    }
  }

  // Démarrer une nouvelle conversation
  async startConversation(req, res) {
    try {
      const { receiverId, initialMessage } = req.body;
      const senderId = req.user._id;

      // Vérifier si une conversation existe déjà
      let conversation = await Conversation.findOne({
        participants: {
          $all: [
            { $elemMatch: { userId: senderId } },
            { $elemMatch: { userId: receiverId } }
          ]
        },
        conversationType: 'direct'
      });

      if (!conversation) {
        // Récupérer les informations des utilisateurs
        const [sender, receiver] = await Promise.all([
          User.findById(senderId).select('name email role'),
          User.findById(receiverId).select('name email role')
        ]);

        if (!sender || !receiver) {
          return res.status(404).json({
            success: false,
            message: 'Utilisateur non trouvé'
          });
        }

        // Créer une nouvelle conversation
        conversation = new Conversation({
          participants: [
            {
              userId: senderId,
              role: sender.role,
              name: sender.name,
              avatar: sender.avatar || ''
            },
            {
              userId: receiverId,
              role: receiver.role,
              name: receiver.name,
              avatar: receiver.avatar || ''
            }
          ],
          conversationType: 'direct',
          createdBy: senderId
        });

        await conversation.save();
      }

      // Si un message initial est fourni
      if (initialMessage) {
        const message = new Message({
          conversationId: conversation._id,
          sender: {
            userId: senderId,
            role: req.user.role,
            name: req.user.name,
            avatar: req.user.avatar || ''
          },
          receiver: {
            userId: receiverId,
            role: conversation.participants.find(p => p.userId.toString() === receiverId.toString()).role,
            name: conversation.participants.find(p => p.userId.toString() === receiverId.toString()).name
          },
          content: initialMessage,
          messageType: 'text'
        });

        await message.save();

        // Mettre à jour la conversation
        conversation.lastMessage = message._id;
        conversation.lastMessageText = message.content;
        conversation.lastMessageTime = message.createdAt;
        conversation.unreadCount = 1;
        await conversation.save();

        // Créer une notification
        await this.createNotification(
          receiverId,
          'message',
          'Nouveau message',
          `${req.user.name} vous a envoyé un message`,
          { conversationId: conversation._id, messageId: message._id }
        );

        // Émettre un événement Socket.io
        req.io.to(receiverId.toString()).emit('new-message', {
          conversationId: conversation._id,
          message,
          sender: req.user
        });
      }

      const populatedConversation = await Conversation.findById(conversation._id)
        .populate('participants.userId', 'name email avatar role')
        .populate('lastMessage');

      res.status(200).json({
        success: true,
        conversation: populatedConversation,
        message: initialMessage ? 'Conversation démarrée avec succès' : 'Conversation retrouvée'
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du démarrage de la conversation'
      });
    }
  }

  // Obtenir les messages d'une conversation
  async getMessages(req, res) {
    try {
      const { conversationId } = req.params;
      const userId = req.user._id;
      const { page = 1, limit = 50, before } = req.query;

      // Vérifier que l'utilisateur fait partie de la conversation
      const conversation = await Conversation.findOne({
        _id: conversationId,
        'participants.userId': userId
      });

      if (!conversation) {
        return res.status(403).json({
          success: false,
          message: 'Accès non autorisé à cette conversation'
        });
      }

      // Construire la requête
      let query = { conversationId };
      if (before) {
        query.createdAt = { $lt: new Date(before) };
      }

      const messages = await Message.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('sender.userId', 'name avatar')
        .populate('receiver.userId', 'name avatar');

      // Marquer les messages comme lus
      await Message.updateMany(
        {
          conversationId,
          'receiver.userId': userId,
          isRead: false
        },
        {
          $set: { isRead: true, readAt: new Date() }
        }
      );

      // Mettre à jour le compteur de non lus
      conversation.unreadCount = 0;
      await conversation.save();

      res.status(200).json({
        success: true,
        messages: messages.reverse(),
        conversation,
        hasMore: messages.length === parseInt(limit)
      });
    } catch (error) {
      console.error('Error getting messages:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des messages'
      });
    }
  }

  // Envoyer un message
  async sendMessage(req, res) {
    try {
      const { conversationId, content, messageType = 'text', fileUrl, fileName } = req.body;
      const senderId = req.user._id;

      // Vérifier la conversation
      const conversation = await Conversation.findById(conversationId)
        .populate('participants.userId', 'name email role avatar');

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation non trouvée'
        });
      }

      // Vérifier que l'utilisateur fait partie de la conversation
      const isParticipant = conversation.participants.some(
        p => p.userId._id.toString() === senderId.toString()
      );

      if (!isParticipant) {
        return res.status(403).json({
          success: false,
          message: 'Vous ne faites pas partie de cette conversation'
        });
      }

      // Trouver le destinataire
      const receiver = conversation.participants.find(
        p => p.userId._id.toString() !== senderId.toString()
      );

      // Créer le message
      const message = new Message({
        conversationId,
        sender: {
          userId: senderId,
          role: req.user.role,
          name: req.user.name,
          avatar: req.user.avatar || ''
        },
        receiver: {
          userId: receiver.userId._id,
          role: receiver.role,
          name: receiver.name
        },
        content,
        messageType,
        fileUrl: fileUrl || '',
        fileName: fileName || ''
      });

      await message.save();

      // Mettre à jour la conversation
      conversation.lastMessage = message._id;
      conversation.lastMessageText = content;
      conversation.lastMessageTime = message.createdAt;
      conversation.unreadCount = (conversation.unreadCount || 0) + 1;
      await conversation.save();

      // Créer une notification
      await this.createNotification(
        receiver.userId._id,
        'message',
        'Nouveau message',
        `${req.user.name} : ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
        { conversationId, messageId: message._id }
      );

      // Émettre un événement Socket.io
      req.io.to(receiver.userId._id.toString()).emit('new-message', {
        conversationId,
        message,
        sender: req.user
      });

      res.status(201).json({
        success: true,
        message: 'Message envoyé avec succès',
        data: message
      });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi du message'
      });
    }
  }

  // Marquer une conversation comme lue
  async markConversationAsRead(req, res) {
    try {
      const { conversationId } = req.params;
      const userId = req.user._id;

      await Message.updateMany(
        {
          conversationId,
          'receiver.userId': userId,
          isRead: false
        },
        {
          $set: { isRead: true, readAt: new Date() }
        }
      );

      await Conversation.findByIdAndUpdate(conversationId, {
        $set: { unreadCount: 0 }
      });

      res.status(200).json({
        success: true,
        message: 'Conversation marquée comme lue'
      });
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour'
      });
    }
  }

  // Obtenir le nombre de messages non lus
  async getUnreadCount(req, res) {
    try {
      const userId = req.user._id;

      const unreadCount = await Message.countDocuments({
        'receiver.userId': userId,
        isRead: false
      });

      res.status(200).json({
        success: true,
        unreadCount
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du compteur'
      });
    }
  }

  // Rechercher des conversations ou des messages
  async searchMessages(req, res) {
    try {
      const { query } = req.query;
      const userId = req.user._id;

      const conversations = await Conversation.find({
        'participants.userId': userId,
        isActive: true
      }).select('_id');

      const conversationIds = conversations.map(c => c._id);

      const messages = await Message.find({
        conversationId: { $in: conversationIds },
        content: { $regex: query, $options: 'i' }
      })
      .populate('sender.userId', 'name avatar')
      .populate('receiver.userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(50);

      res.status(200).json({
        success: true,
        messages,
        count: messages.length
      });
    } catch (error) {
      console.error('Error searching messages:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la recherche'
      });
    }
  }

  // Méthode utilitaire pour créer des notifications
  async createNotification(userId, type, title, content, data = {}) {
    try {
      const notification = new Notification({
        userId,
        type,
        title,
        content,
        data,
        priority: type === 'message' ? 'high' : 'medium'
      });

      await notification.save();

      // Émettre une notification via Socket.io
      const io = require('../services/socketService').getIO();
      if (io) {
        io.to(userId.toString()).emit('new-notification', notification);
      }

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }
}

module.exports = new MessagingController();