const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Offer = require('../models/Offer');
const Application = require('../models/Application');

// Dans getDashboardStats, ajoutez :
exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const totalOffers = await Offer.countDocuments();
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    const acceptedApplications = await Application.countDocuments({ status: 'accepted' });
    const rejectedApplications = await Application.countDocuments({ status: 'rejected' });

    res.json({
      totalStudents,
      totalCompanies,
      totalOffers,
      totalApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lister tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Désactiver/supprimer un utilisateur
exports.manageUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (req.body.action === 'disable') {
      user.active = false;
      await user.save();
      res.json({ message: 'Utilisateur désactivé' });
    } else if (req.body.action === 'enable') {
      user.active = true;
      await user.save();
      res.json({ message: 'Utilisateur activé' });
    } else if (req.body.action === 'delete') {
      await User.findByIdAndDelete(req.params.id);
      
      // Supprimer aussi le profil associé
      if (user.role === 'student') {
        await Student.findOneAndDelete({ userId: req.params.id });
      } else if (user.role === 'company') {
        await Company.findOneAndDelete({ userId: req.params.id });
        // Supprimer aussi les offres de l'entreprise
        await Offer.deleteMany({ companyId: req.params.id });
      }
      
      res.json({ message: 'Utilisateur supprimé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Gérer les offres (supprimer offres inappropriées)
exports.manageOffers = async (req, res) => {
  try {
    if (req.body.action === 'delete') {
      await Offer.findByIdAndDelete(req.params.id);
      res.json({ message: 'Offre supprimée' });
    } else if (req.body.action === 'deactivate') {
      await Offer.findByIdAndUpdate(req.params.id, { active: false });
      res.json({ message: 'Offre désactivée' });
    } else if (req.body.action === 'activate') {
      await Offer.findByIdAndUpdate(req.params.id, { active: true });
      res.json({ message: 'Offre activée' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};