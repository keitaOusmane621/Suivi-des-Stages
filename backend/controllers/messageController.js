const Message = require('../models/Message');
const User = require('../models/User');

// Envoyer un message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, subject, content } = req.body;
    
    // Vérifier si le destinataire existe
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Destinataire non trouvé' });
    }
    
    // Créer un ID de conversation unique
    const conversationId = [req.user._id, receiverId]
      .sort()
      .join('_');
    
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      subject,
      content,
      conversationId
    });
    
    // Populer les informations de l'expéditeur et du destinataire
    await message.populate('sender', 'email');
    await message.populate('receiver', 'email');
    
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les conversations
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { receiver: req.user._id }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ['$receiver', req.user._id] },
                  { $eq: ['$read', false] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'lastMessage.sender',
          foreignField: '_id',
          as: 'senderInfo'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'lastMessage.receiver',
          foreignField: '_id',
          as: 'receiverInfo'
        }
      },
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          unreadCount: 1,
          otherUser: {
            $cond: [
              { $eq: [req.user._id, { $arrayElemAt: ['$senderInfo._id', 0] }] },
              { $arrayElemAt: ['$receiverInfo', 0] },
              { $arrayElemAt: ['$senderInfo', 0] }
            ]
          }
        }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les messages d'une conversation
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Créer l'ID de conversation
    const conversationId = [req.user._id, userId]
      .sort()
      .join('_');
    
    const messages = await Message.find({ conversationId })
      .populate('sender', 'email')
      .populate('receiver', 'email')
      .sort({ createdAt: 1 });
    
    // Marquer les messages comme lus
    await Message.updateMany(
      {
        conversationId,
        receiver: req.user._id,
        read: false
      },
      { read: true }
    );
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Compter les messages non lus
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      read: false
    });
    
    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};