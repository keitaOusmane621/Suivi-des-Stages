const express = require('express');
const { 
  applyToOffer, 
  getStudentApplications, 
  getCompanyApplications, 
  updateApplicationStatus 
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/offers/:offerId/apply', protect, authorize('student'), applyToOffer);
router.get('/my-applications', protect, authorize('student'), getStudentApplications);
router.get('/company-applications', protect, authorize('company'), getCompanyApplications);
router.put('/:id/status', protect, authorize('company'), updateApplicationStatus);

module.exports = router;