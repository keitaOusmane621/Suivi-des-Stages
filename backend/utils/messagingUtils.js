class MessagingUtils {
  // Formater un message pour l'affichage
  static formatMessage(message, currentUserId) {
    return {
      id: message._id,
      content: message.content,
      sender: {
        id: message.sender.userId._id,
        name: message.sender.name,
        avatar: message.sender.avatar,
        role: message.sender.role
      },
      receiver: {
        id: message.receiver.userId._id,
        name: message.receiver.name,
        role: message.receiver.role
      },
      isOwn: message.sender.userId._id.toString() === currentUserId.toString(),
      isRead: message.isRead,
      readAt: message.readAt,
      createdAt: message.createdAt,
      messageType: message.messageType,
      fileUrl: message.fileUrl,
      fileName: message.fileName,
      reactions: message.reactions || []
    };
  }

  // Formater une conversation
  static formatConversation(conversation, currentUserId) {
    const otherParticipant = conversation.participants.find(
      p => p.userId._id.toString() !== currentUserId.toString()
    );

    return {
      id: conversation._id,
      title: conversation.title || otherParticipant?.name || 'Conversation',
      participants: conversation.participants.map(p => ({
        id: p.userId._id,
        name: p.name,
        email: p.userId.email,
        role: p.role,
        avatar: p.avatar
      })),
      lastMessage: conversation.lastMessage ? {
        id: conversation.lastMessage._id,
        content: conversation.lastMessage.content,
        sender: conversation.lastMessage.sender.name,
        createdAt: conversation.lastMessage.createdAt
      } : null,
      unreadCount: conversation.unreadCount || 0,
      lastMessageTime: conversation.lastMessageTime,
      isActive: conversation.isActive,
      conversationType: conversation.conversationType
    };
  }

  // Valider le contenu d'un message
  static validateMessageContent(content) {
    if (!content || content.trim().length === 0) {
      return {
        valid: false,
        error: 'Le message ne peut pas être vide'
      };
    }

    if (content.length > 2000) {
      return {
        valid: false,
        error: 'Le message est trop long (max 2000 caractères)'
      };
    }

    // Filtrer le contenu (optionnel)
    const filteredContent = this.filterContent(content);

    return {
      valid: true,
      content: filteredContent
    };
  }

  // Filtrer le contenu (protection contre XSS)
  static filterContent(content) {
    return content
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .trim();
  }

  // Générer un ID de conversation basé sur les participants
  static generateConversationId(userId1, userId2) {
    const ids = [userId1.toString(), userId2.toString()].sort();
    return `conv_${ids.join('_')}`;
  }
}

module.exports = MessagingUtils;