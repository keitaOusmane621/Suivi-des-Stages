const express = require('express');
const { getAllCompanies, getCompanyById, updateCompany } = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/', protect, getAllCompanies);
router.get('/:id', protect, getCompanyById);
router.put('/:id', protect, authorize('company', 'admin'), updateCompany);

module.exports = router;