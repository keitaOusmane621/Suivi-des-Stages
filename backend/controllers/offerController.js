const Offer = require('../models/Offer');
const Company = require('../models/Company');

// Créer une offre de stage
exports.createOffer = async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }

    const offer = await Offer.create({
      ...req.body,
      companyId: company._id
    });

    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer toutes les offres
exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find()
      .populate('companyId', 'name sector address')
      .sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une offre par ID
exports.getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate('companyId', 'name sector address website');
    if (!offer) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour une offre
exports.updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!offer) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer une offre
exports.deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }
    res.json({ message: 'Offre supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};