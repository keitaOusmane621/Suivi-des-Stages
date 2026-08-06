const Message = require('../models/Message');
const User = require('../models/User');

// ============================================
// 1. Récupérer les conversations
// ============================================
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    console.log('🔍 getConversations - userId:', userId);

    // Récupérer tous les messages où l'utilisateur est impliqué
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'email firstName lastName role')
      .populate('recipient', 'email firstName lastName role');

    console.log(`📦 ${messages.length} messages trouvés`);

    // Extraire les contacts uniques
    const contactsMap = new Map();
    messages.forEach((msg) => {
      const contactId = msg.sender._id.toString() === userId ? msg.recipient._id.toString() : msg.sender._id.toString();
      if (!contactsMap.has(contactId)) {
        contactsMap.set(contactId, {
          user: msg.sender._id.toString() === userId ? msg.recipient : msg.sender,
          lastMessage: msg,
          unreadCount: 0,
        });
      }
      // Compter les messages non lus pour ce contact
      if (msg.recipient._id.toString() === userId && !msg.read) {
        contactsMap.get(contactId).unreadCount += 1;
      }
    });

    const conversations = Array.from(contactsMap.values()).sort(
      (a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt
    );

    console.log(`📋 ${conversations.length} conversations trouvées`);
    res.json(conversations);
  } catch (error) {
    console.error('❌ Erreur getConversations:', error);
    res.status(500).json({ message: 'Erreur lors du chargement des conversations' });
  }
};

// ============================================
// 2. Récupérer les messages d'une conversation
// ============================================
exports.getConversationMessages = async (req, res) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id || req.user.id;

    console.log(`🔍 getConversationMessages - contact: ${contactId}, user: ${userId}`);

    const contact = await User.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: contactId },
        { sender: contactId, recipient: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'email firstName lastName role')
      .populate('recipient', 'email firstName lastName role');

    // Marquer comme lus
    await Message.updateMany(
      { sender: contactId, recipient: userId, read: false },
      { read: true, readAt: new Date() }
    );

    res.json(messages);
  } catch (error) {
    console.error('❌ Erreur getConversationMessages:', error);
    res.status(500).json({ message: 'Erreur lors du chargement des messages' });
  }
};

// ============================================
// 3. Envoyer un message
// ============================================
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.user._id || req.user.id;

    if (!recipientId || !content) {
      return res.status(400).json({ message: 'Destinataire et contenu requis' });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Destinataire introuvable' });
    }

    const message = new Message({
      sender: senderId,
      recipient: recipientId,
      content: content.trim(),
    });
    await message.save();

    await message.populate('sender', 'email firstName lastName role');
    await message.populate('recipient', 'email firstName lastName role');

    res.status(201).json(message);
  } catch (error) {
    console.error('❌ Erreur sendMessage:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi du message' });
  }
};

// ============================================
// 4. Marquer comme lu
// ============================================
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id || req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message introuvable' });
    }

    if (message.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    message.read = true;
    message.readAt = new Date();
    await message.save();

    res.json({ message: 'Message marqué comme lu' });
  } catch (error) {
    console.error('❌ Erreur markAsRead:', error);
    res.status(500).json({ message: 'Erreur lors du marquage' });
  }
};

// ============================================
// 5. Récupérer le nombre de messages non lus
// ============================================
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const count = await Message.countDocuments({ recipient: userId, read: false });
    res.json({ count });
  } catch (error) {
    console.error('❌ Erreur getUnreadCount:', error);
    res.status(500).json({ message: 'Erreur lors du comptage' });
  }
};