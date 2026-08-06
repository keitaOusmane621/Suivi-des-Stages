const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getOffers,
  updateOfferStatus,
} = require('../controllers/adminController');

// Toutes les routes admin sont protégées par le rôle 'admin'
router.use(protect, authorize('admin'));

// Statistiques du tableau de bord
router.get('/dashboard-stats', getDashboardStats);

// Gestion des utilisateurs
router.get('/users', getUsers);
router.put('/users/:userId', updateUserStatus);

// Gestion des offres
router.get('/offers', getOffers);
router.put('/offers/:offerId', updateOfferStatus);

module.exports = router;