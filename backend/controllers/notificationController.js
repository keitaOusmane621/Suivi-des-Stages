const Notification = require('../models/Notification');

class NotificationController {
  async getNotifications(req, res) {
    try {
      const userId = req.user._id;
      const { page = 1, limit = 20, unreadOnly = false } = req.query;

      const query = { userId };
      if (unreadOnly === 'true') {
        query.isRead = false;
      }

      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const total = await Notification.countDocuments(query);
      const unreadCount = await Notification.countDocuments({ userId, isRead: false });

      res.status(200).json({
        success: true,
        notifications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        unreadCount
      });
    } catch (error) {
      console.error('Error getting notifications:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des notifications'
      });
    }
  }

  async markAsRead(req, res) {
    try {
      const { notificationId } = req.params;
      const userId = req.user._id;

      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true, readAt: new Date() },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification non trouvée'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Notification marquée comme lue',
        notification
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de la notification'
      });
    }
  }

  async markAllAsRead(req, res) {
    try {
      const userId = req.user._id;

      await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      res.status(200).json({
        success: true,
        message: 'Toutes les notifications ont été marquées comme lues'
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour des notifications'
      });
    }
  }

  async deleteNotification(req, res) {
    try {
      const { notificationId } = req.params;
      const userId = req.user._id;

      const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        userId
      });

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification non trouvée'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Notification supprimée avec succès'
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de la notification'
      });
    }
  }

  async deleteAllNotifications(req, res) {
    try {
      const userId = req.user._id;
      const { unreadOnly } = req.query;

      const query = { userId };
      if (unreadOnly === 'true') {
        query.isRead = false;
      }

      await Notification.deleteMany(query);

      res.status(200).json({
        success: true,
        message: unreadOnly === 'true' 
          ? 'Toutes les notifications non lues ont été supprimées' 
          : 'Toutes les notifications ont été supprimées'
      });
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression des notifications'
      });
    }
  }

  async getUnreadCount(req, res) {
    try {
      const userId = req.user._id;

      const unreadCount = await Notification.countDocuments({
        userId,
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
        message: 'Erreur lors de la récupération du compteur de notifications'
      });
    }
  }
}

module.exports = new NotificationController();