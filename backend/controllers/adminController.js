const User = require('../models/User');
const Offer = require('../models/Offer');
const Application = require('../models/Application');

// ============================================
// 1. Statistiques du tableau de bord
// ============================================
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalStudents, totalCompanies, totalOffers, totalApplications] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'company' }),
      Offer.countDocuments(),
      Application.countDocuments(),
    ]);

    res.json({
      totalStudents,
      totalCompanies,
      totalOffers,
      totalApplications,
    });
  } catch (error) {
    console.error('❌ Erreur getDashboardStats:', error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// 2. Récupérer tous les utilisateurs
// ============================================
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('❌ Erreur getUsers:', error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// 3. Activer / désactiver un utilisateur
// ============================================
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.body; // 'enable' ou 'disable'

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    if (action === 'enable') {
      user.active = true;
    } else if (action === 'disable') {
      user.active = false;
    } else if (action === 'delete') {
      await user.deleteOne();
      return res.json({ message: 'Utilisateur supprimé' });
    } else {
      return res.status(400).json({ message: 'Action non supportée' });
    }

    await user.save();
    res.json({ message: `Utilisateur ${action === 'enable' ? 'activé' : 'désactivé'} avec succès` });
  } catch (error) {
    console.error('❌ Erreur updateUserStatus:', error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// 4. Récupérer toutes les offres (admin)
// ============================================
exports.getOffers = async (req, res) => {
  try {
    const offers = await Offer.find().populate('companyId', 'name email').sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    console.error('❌ Erreur getOffers:', error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// 5. Activer / désactiver une offre (admin)
// ============================================
exports.updateOfferStatus = async (req, res) => {
  try {
    const { offerId } = req.params;
    const { action } = req.body; // 'activate' ou 'deactivate'

    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ message: 'Offre introuvable' });
    }

    if (action === 'activate') {
      offer.active = true;
    } else if (action === 'deactivate') {
      offer.active = false;
    } else {
      return res.status(400).json({ message: 'Action non supportée' });
    }

    await offer.save();
    res.json({ message: `Offre ${action === 'activate' ? 'activée' : 'désactivée'} avec succès` });
  } catch (error) {
    console.error('❌ Erreur updateOfferStatus:', error);
    res.status(500).json({ message: error.message });
  }
};