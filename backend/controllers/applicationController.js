const Application = require('../models/Application');
const Offer = require('../models/Offer');
const Student = require('../models/Student');

// Postuler à une offre
exports.applyToOffer = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Profil étudiant non trouvé' });
    }

    const application = await Application.create({
      offerId: req.params.offerId,
      studentId: student._id,
      motivationLetter: req.body.motivationLetter,
      status: 'pending'
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les candidatures d'un étudiant
exports.getStudentApplications = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    const applications = await Application.find({ studentId: student._id })
      .populate('offerId', 'title companyId')
      .populate({
        path: 'offerId',
        populate: { path: 'companyId', select: 'name' }
      });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les candidatures pour une entreprise
exports.getCompanyApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate({
        path: 'offerId',
        match: { companyId: req.user.companyId },
        populate: { path: 'companyId', select: 'name' }
      })
      .populate('studentId', 'firstName lastName education skills');

    res.json(applications.filter(app => app.offerId !== null));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour le statut d'une candidature
exports.updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};