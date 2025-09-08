const Company = require('../models/Company');
const User = require('../models/User');

// Récupérer toutes les entreprises
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate('userId', 'email');
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une entreprise par ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate('userId', 'email');
    if (!company) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour une entreprise
exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!company) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};