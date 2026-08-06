const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  applyToOffer,
  getStudentApplications,
  getCompanyApplications,
  updateApplicationStatus,
  downloadFile,
  cancelApplication,
} = require('../controllers/applicationController');

// Routes pour les étudiants
router.post('/offers/:offerId/apply', protect, authorize('student'), applyToOffer);
router.get('/my-applications', protect, authorize('student'), getStudentApplications);
router.delete('/:id', protect, authorize('student'), cancelApplication);

// Routes pour les entreprises
router.get('/company-applications', protect, authorize('company'), getCompanyApplications);
router.put('/:id/status', protect, authorize('company'), updateApplicationStatus); // ← OK

// Téléchargement de fichiers
router.get('/:id/download', protect, downloadFile);

module.exports = router;