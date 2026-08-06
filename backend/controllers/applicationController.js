const Application = require('../models/Application');
const Offer = require('../models/Offer');
const fs = require('fs');
const path = require('path');
const sendEmail = require('../utils/email');

const uploadDir = 'uploads/applications';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

exports.applyToOffer = async (req, res) => {
  try {
    console.log('📥 Body:', req.body);
    console.log('📎 req.files:', req.files);
    console.log('👤 req.user:', req.user);

    const { offerId } = req.params;
    const studentId = req.user?._id || req.user?.id;
    if (!studentId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ message: 'Offre introuvable' });
    }

    const message = req.body.message || req.body.undefined || '';

    let cvFile = null;
    let motivationFile = null;

    if (req.files) {
      if (req.files.cv) cvFile = Array.isArray(req.files.cv) ? req.files.cv[0] : req.files.cv;
      if (req.files.motivationLetter) motivationFile = Array.isArray(req.files.motivationLetter) ? req.files.motivationLetter[0] : req.files.motivationLetter;

      if (!cvFile || !motivationFile) {
        const undefinedFiles = req.files.undefined;
        if (undefinedFiles && Array.isArray(undefinedFiles)) {
          if (undefinedFiles.length >= 1) cvFile = undefinedFiles[0];
          if (undefinedFiles.length >= 2) motivationFile = undefinedFiles[1];
        }
      }

      if (!cvFile || !motivationFile) {
        const keys = Object.keys(req.files);
        for (const key of keys) {
          const fileArray = req.files[key];
          if (Array.isArray(fileArray) && fileArray.length > 0) {
            if (!cvFile) {
              cvFile = fileArray[0];
            } else if (!motivationFile) {
              motivationFile = fileArray[0];
              break;
            }
          }
        }
      }
    }

    console.log('📄 cvFile :', cvFile ? cvFile.name : '❌');
    console.log('📄 motivationFile :', motivationFile ? motivationFile.name : '❌');

    if (!cvFile || !motivationFile) {
      return res.status(400).json({ message: 'CV et lettre de motivation requis' });
    }

    const cvPath = path.join(uploadDir, Date.now() + '-' + cvFile.name);
    const motPath = path.join(uploadDir, Date.now() + '-' + motivationFile.name);

    fs.renameSync(cvFile.tempFilePath, cvPath);
    fs.renameSync(motivationFile.tempFilePath, motPath);

    const existing = await Application.findOne({ student: studentId, offer: offerId });
    if (existing) {
      return res.status(400).json({ message: 'Vous avez déjà postulé à cette offre (duplication)' });
    }

    const application = new Application({
      student: studentId,
      offer: offerId,
      cv: cvPath,
      motivationLetter: motPath,
      message: message,
      status: 'pending',
    });
    await application.save();

    res.status(201).json({
      message: 'Candidature envoyée avec succès',
      application,
    });
  } catch (error) {
    console.error('❌ Erreur applyToOffer:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Vous avez déjà postulé à cette offre (duplication)',
      });
    }
    res.status(500).json({ message: 'Erreur serveur: ' + error.message });
  }
};


// Récupérer les candidatures de l'étudiant
exports.getStudentApplications = async (req, res) => {
  try {
    const studentId = req.user?._id || req.user?.id;
    if (!studentId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }
    const applications = await Application.find({ student: studentId })
      .populate({
        path: 'offer',
        populate: { path: 'companyId', select: 'name email' },
      })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error('❌ Erreur getStudentApplications:', error);
    res.status(500).json({ message: error.message });
  }
};


// Récupérer les candidatures pour une entreprise
exports.getCompanyApplications = async (req, res) => {
  try {
    const companyId = req.user?._id || req.user?.id;
    if (!companyId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const offers = await Offer.find({ companyId });
    const offerIds = offers.map((o) => o._id);

    if (offerIds.length === 0) {
      return res.json([]);
    }

    const applications = await Application.find({ offer: { $in: offerIds } })
      .populate('student', 'email firstName lastName')
      .populate({
        path: 'offer',
        select: 'title companyId location duration',
      })
      .sort({ createdAt: -1 });

    console.log(`📋 ${applications.length} candidature(s) trouvée(s) pour l'entreprise`);
    res.json(applications);
  } catch (error) {
    console.error('❌ Erreur getCompanyApplications:', error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// 4. Mettre à jour le statut d'une candidature + envoi d'email
// ============================================
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const companyId = req.user?._id || req.user?.id;

    console.log('📝 Mise à jour statut:', { id, status, companyId });

    if (!companyId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    // Récupérer la candidature avec les infos de l'offre et du student
    const application = await Application.findById(id)
      .populate('student', 'email firstName lastName')
      .populate({
        path: 'offer',
        populate: { path: 'companyId', select: 'name' }
      });

    if (!application) {
      return res.status(404).json({ message: 'Candidature introuvable' });
    }

    console.log('🔍 application.offer.companyId:', application.offer.companyId);
    console.log('🔍 companyId (req.user):', companyId);

    // Vérifier que l'offre a bien un companyId
    if (!application.offer.companyId) {
      return res.status(400).json({ message: 'Offre sans entreprise associée' });
    }

    // Comparer les IDs (en convertissant en string)
    const offerCompanyId = application.offer.companyId._id ? application.offer.companyId._id.toString() : application.offer.companyId.toString();
    const userCompanyId = companyId.toString();

    console.log('🔍 offerCompanyId:', offerCompanyId);
    console.log('🔍 userCompanyId:', userCompanyId);

    if (offerCompanyId !== userCompanyId) {
      return res.status(403).json({ message: 'Accès non autorisé : cette candidature ne vous appartient pas' });
    }

    // Mettre à jour le statut
    application.status = status;
    await application.save();

    // Envoyer un email si le statut est accepted ou rejected
    if (['accepted', 'rejected'].includes(status)) {
      const student = application.student;
      const offerTitle = application.offer.title;
      const companyName = application.offer.companyId?.name || 'l\'entreprise';

      if (student && student.email) {
        const subject = status === 'accepted'
          ? `✅ Votre candidature pour "${offerTitle}" a été acceptée !`
          : `❌ Votre candidature pour "${offerTitle}" a été refusée`;

        const messageHtml = status === 'accepted'
          ? `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #22c55e;">Félicitations ! 🎉</h2>
              <p>Bonjour ${student.firstName || 'Cher(e) candidat(e)'},</p>
              <p>Votre candidature pour l'offre <strong>"${offerTitle}"</strong> a été <strong>acceptée</strong> par <strong>${companyName}</strong>.</p>
              <p>Nous vous invitons à contacter l'entreprise pour la suite du processus.</p>
              <p>Bonne continuation !</p>
              <hr>
              <p style="color: #666; font-size: 0.9em;">Ce message est envoyé automatiquement par StageTrack.</p>
            </div>
          `
          : `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #ef4444;">Nous sommes désolés</h2>
              <p>Bonjour ${student.firstName || 'Cher(e) candidat(e)'},</p>
              <p>Votre candidature pour l'offre <strong>"${offerTitle}"</strong> a été <strong>refusée</strong> par <strong>${companyName}</strong>.</p>
              <p>Nous vous encourageons à postuler à d'autres offres.</p>
              <p>Bonne chance !</p>
              <hr>
              <p style="color: #666; font-size: 0.9em;">Ce message est envoyé automatiquement par StageTrack.</p>
            </div>
          `;

        try {
          await sendEmail({
            to: student.email,
            subject,
            html: messageHtml,
          });
          console.log(`✅ Email envoyé à ${student.email} (${status})`);
        } catch (emailError) {
          console.error('❌ Erreur envoi email:', emailError);
          // Ne pas bloquer la réponse si l'email échoue
        }
      }
    }

    res.json({
      message: `Candidature ${status === 'accepted' ? 'acceptée' : 'refusée'} avec succès`,
      application,
    });
  } catch (error) {
    console.error('❌ Erreur updateApplicationStatus:', error);
    res.status(500).json({ message: 'Erreur serveur: ' + error.message });
  }
};

// ============================================
// 5. Télécharger un fichier (CV ou LM)
// ============================================
exports.downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;

    const application = await Application.findById(id).populate('offer');
    if (!application) {
      return res.status(404).json({ message: 'Candidature introuvable' });
    }

    const userId = req.user?._id || req.user?.id;
    const isStudent = application.student.toString() === userId;
    const isCompany = req.user.role === 'company' && application.offer.companyId.toString() === userId;

    if (!isStudent && !isCompany) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const filePath = type === 'cv' ? application.cv : application.motivationLetter;
    if (!filePath) {
      return res.status(404).json({ message: 'Fichier non trouvé' });
    }

    res.download(filePath);
  } catch (error) {
    console.error('❌ Erreur downloadFile:', error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// 6. Annuler une candidature (étudiant)
// ============================================
exports.cancelApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user?._id || req.user?.id;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Candidature introuvable' });
    }

    if (application.student.toString() !== studentId) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ message: 'Impossible d\'annuler une candidature déjà traitée' });
    }

    await application.deleteOne();
    res.json({ message: 'Candidature annulée avec succès' });
  } catch (error) {
    console.error('❌ Erreur cancelApplication:', error);
    res.status(500).json({ message: error.message });
  }
};