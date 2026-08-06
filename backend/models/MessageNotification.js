const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['message', 'application', 'offer', 'system'],
    default: 'message'
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  data: {
    conversationId: Schema.Types.ObjectId,
    messageId: Schema.Types.ObjectId,
    offerId: Schema.Types.ObjectId,
    applicationId: Schema.Types.ObjectId
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
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Index
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;