const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Middleware de protection (temporairement commenté pour tester)
// router.use(protect);

// Routes factices pour tester
router.get('/conversations', (req, res) => {
  res.json([{ user: { _id: '123', firstName: 'Test', lastName: 'User' }, lastMessage: { content: 'Hello' }, unreadCount: 0 }]);
});

router.get('/unread-count', (req, res) => {
  res.json({ count: 0 });
});

module.exports = router;