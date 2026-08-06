const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['message', 'application', 'offer', 'system', 'warning'],
    default: 'message'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    default: '🔔'
  },
  data: {
    type: Schema.Types.Mixed,
    default: {}
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  actionUrl: {
    type: String,
    default: ''
  },
  actionLabel: {
    type: String,
    default: ''
  },
  expiresAt: {
    type: Date,
    default: null
  },
  source: {
    type: String,
    enum: ['system', 'user', 'company', 'admin'],
    default: 'system'
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour les performances
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
notificationSchema.index({ type: 1, isRead: 1 });

// Méthode pour marquer comme lue
notificationSchema.methods.markAsRead = function() {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
  }
  return this.save();
};

// Méthode statique pour créer des notifications
notificationSchema.statics.createNotification = async function(data) {
  try {
    const notification = new this({
      userId: data.userId,
      type: data.type || 'system',
      title: data.title,
      content: data.content,
      icon: data.icon || this.getIconByType(data.type),
      data: data.data || {},
      priority: data.priority || 'medium',
      actionUrl: data.actionUrl || '',
      actionLabel: data.actionLabel || '',
      expiresAt: data.expiresAt || null,
      source: data.source || 'system',
      metadata: data.metadata || {}
    });

    await notification.save();
    
    // Émettre un événement Socket.io si disponible
    const io = require('../services/socketService').getIO();
    if (io) {
      io.to(data.userId.toString()).emit('new-notification', notification);
    }
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Méthode pour déterminer l'icône par type
notificationSchema.statics.getIconByType = function(type) {
  const icons = {
    message: '💬',
    application: '📨',
    offer: '💼',
    system: '🔔',
    warning: '⚠️'
  };
  return icons[type] || '🔔';
};

// Méthode statique pour envoyer une notification à plusieurs utilisateurs
notificationSchema.statics.bulkCreate = async function(usersData, commonData) {
  try {
    const notifications = usersData.map(userData => ({
      userId: userData.userId,
      type: commonData.type || 'system',
      title: commonData.title,
      content: commonData.content,
      icon: commonData.icon || this.getIconByType(commonData.type),
      data: commonData.data || {},
      priority: commonData.priority || 'medium',
      actionUrl: commonData.actionUrl || '',
      actionLabel: commonData.actionLabel || '',
      expiresAt: commonData.expiresAt || null,
      source: commonData.source || 'system',
      metadata: {
        ...commonData.metadata,
        recipientInfo: userData.metadata || {}
      }
    }));

    const createdNotifications = await this.insertMany(notifications);
    
    // Émettre des événements Socket.io
    const io = require('../services/socketService').getIO();
    if (io) {
      usersData.forEach(userData => {
        const userNotification = createdNotifications.find(
          n => n.userId.toString() === userData.userId.toString()
        );
        if (userNotification) {
          io.to(userData.userId.toString()).emit('new-notification', userNotification);
        }
      });
    }
    
    return createdNotifications;
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
    throw error;
  }
};

// Méthode pour obtenir les notifications non lues d'un utilisateur
notificationSchema.statics.getUnreadForUser = async function(userId) {
  return this.find({
    userId,
    isRead: false,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ]
  })
  .sort({ createdAt: -1 })
  .limit(50);
};

// Méthode pour marquer toutes les notifications comme lues pour un utilisateur
notificationSchema.statics.markAllAsRead = async function(userId) {
  const result = await this.updateMany(
    {
      userId,
      isRead: false
    },
    {
      $set: {
        isRead: true,
        readAt: new Date()
      }
    }
  );

  // Émettre un événement de mise à jour
  const io = require('../services/socketService').getIO();
  if (io) {
    io.to(userId.toString()).emit('notifications-read', { count: result.nModified });
  }

  return result;
};

// Virtual pour vérifier si la notification est expirée
notificationSchema.virtual('isExpired').get(function() {
  if (!this.expiresAt) return false;
  return this.expiresAt < new Date();
});

// Virtual pour le temps écoulé depuis la création
notificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffMs = now - this.createdAt;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) return `${diffDay} jour${diffDay > 1 ? 's' : ''}`;
  if (diffHour > 0) return `${diffHour} heure${diffHour > 1 ? 's' : ''}`;
  if (diffMin > 0) return `${diffMin} min${diffMin > 1 ? 's' : ''}`;
  return 'À l\'instant';
});

// Pré-hook pour nettoyer les notifications expirées
notificationSchema.pre('find', function() {
  this.where({
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ]
  });
});

// Méthode pour supprimer les notifications expirées
notificationSchema.statics.cleanupExpired = async function() {
  const result = await this.deleteMany({
    expiresAt: { $lte: new Date() }
  });
  console.log(`🗑️  ${result.deletedCount} notifications expirées supprimées`);
  return result;
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;