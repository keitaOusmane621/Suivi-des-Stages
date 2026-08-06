const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Obtenir toutes les notifications
router.get('/', notificationController.getNotifications);

// Marquer une notification comme lue
router.put('/:notificationId/read', notificationController.markAsRead);

// Marquer toutes les notifications comme lues
router.put('/read-all', notificationController.markAllAsRead);

// Supprimer une notification
router.delete('/:notificationId', notificationController.deleteNotification);

// Supprimer toutes les notifications
router.delete('/', notificationController.deleteAllNotifications);

// Obtenir le nombre de notifications non lues
router.get('/unread-count', notificationController.getUnreadCount);

module.exports = router;