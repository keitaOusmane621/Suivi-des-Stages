const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createOffer,
  getCompanyOffers,
  getAllOffers,
  getOfferById,
  updateOffer,
  deleteOffer
} = require('../controllers/offerController');

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', protect, getAllOffers);
router.get('/:id', protect, getOfferById);

// Routes réservées aux entreprises
router.get('/company', protect, authorize('company'), getCompanyOffers);
router.post('/', protect, authorize('company'), createOffer);
router.put('/:id', protect, authorize('company'), updateOffer);
router.delete('/:id', protect, authorize('company'), deleteOffer);

module.exports = router;