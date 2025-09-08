const express = require('express');
const { createOffer, getAllOffers, getOfferById, updateOffer, deleteOffer } = require('../controllers/offerController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, authorize('company'), createOffer);
router.get('/', protect, getAllOffers);
router.get('/:id', protect, getOfferById);
router.put('/:id', protect, authorize('company'), updateOffer);
router.delete('/:id', protect, authorize('company'), deleteOffer);

module.exports = router;