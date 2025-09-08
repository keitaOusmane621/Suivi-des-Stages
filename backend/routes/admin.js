const express = require('express');
const { 
  getDashboardStats, 
  getAllUsers, 
  manageUser, 
  manageOffers 
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// Toutes les routes admin nécessitent le rôle admin
router.use(protect, authorize('admin'));

router.get('/dashboard-stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id', manageUser);
router.put('/offers/:id', manageOffers);

module.exports = router;