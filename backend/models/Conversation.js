const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  participants: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['student', 'company', 'admin'],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: ''
    }
  }],
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageText: {
    type: String,
    default: ''
  },
  lastMessageTime: {
    type: Date,
    default: Date.now
  },
  unreadCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  conversationType: {
    type: String,
    enum: ['direct', 'group'],
    default: 'direct'
  },
  title: {
    type: String,
    default: ''
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour les recherches rapides
conversationSchema.index({ 'participants.userId': 1 });
conversationSchema.index({ lastMessageTime: -1 });
conversationSchema.index({ createdAt: -1 });

// Méthode pour ajouter un participant
conversationSchema.methods.addParticipant = function(userId, role, name) {
  const exists = this.participants.some(p => p.userId.toString() === userId.toString());
  if (!exists) {
    this.participants.push({ userId, role, name });
  }
  return this;
};

// Méthode pour marquer comme lu
conversationSchema.methods.markAsRead = function(userId) {
  this.unreadCount = 0;
  return this.save();
};

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;