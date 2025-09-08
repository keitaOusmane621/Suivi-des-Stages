const crypto = require('crypto');
const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const jwt = require('jsonwebtoken');

// Essayez d'importer le module email, ou créez une fonction de simulation
let sendEmail;
try {
  sendEmail = require('../utils/email');
} catch (error) {
  console.warn('Module email non trouvé, utilisation du mode simulation');
  sendEmail = async (options) => {
    console.log('=== EMAIL SIMULATION ===');
    console.log('À:', options.email);
    console.log('Sujet:', options.subject);
    if (options.message.includes('href="')) {
      // Extraire le lien de réinitialisation pour l'affichage
      const linkMatch = options.message.match(/href="([^"]*)"/);
      if (linkMatch) {
        console.log('Lien de réinitialisation:', linkMatch[1]);
      }
    }
    console.log('========================');
    return true;
  };
}

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Inscription
exports.register = async (req, res) => {
  try {
    const { email, password, role, ...profileData } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    
    // Créer l'utilisateur
    const user = await User.create({ email, password, role });
    
    // Créer le profil selon le rôle
    if (role === 'student') {
      await Student.create({ 
        userId: user._id, 
        ...profileData 
      });
    } else if (role === 'company') {
      await Company.create({ 
        userId: user._id, 
        ...profileData 
      });
    }
    
    // Générer le token
    const token = generateToken(user._id);
    
    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
    
    // Vérifier si le compte est actif
    if (!user.active) {
      return res.status(401).json({ message: 'Ce compte a été désactivé' });
    }
    
    // Vérifier le mot de passe
    const isPasswordCorrect = await user.correctPassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
    
    // Générer le token
    const token = generateToken(user._id);
    
    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer le profil utilisateur
exports.getProfile = async (req, res) => {
  try {
    let profile;
    
    if (req.user.role === 'student') {
      profile = await Student.findOne({ userId: req.user._id });
    } else if (req.user.role === 'company') {
      profile = await Company.findOne({ userId: req.user._id });
    }
    
    res.json({
      user: {
        _id: req.user._id,
        email: req.user.email,
        role: req.user.role
      },
      profile
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mot de passe oublié - Demande de réinitialisation
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // 1. Vérifier si l'utilisateur existe
    const user = await User.findOne({ email, active: true });
    
    // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
    if (!user) {
      return res.status(200).json({
        status: 'success',
        message: 'Si votre email est enregistré, vous recevrez un lien de réinitialisation.'
      });
    }
    
    // 2. Générer le token de réinitialisation
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    
    // 3. Envoyer l'email (ou simuler l'envoi)
    const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b71ca;">Réinitialisation de mot de passe</h2>
        <p>Vous avez demandé la réinitialisation de votre mot de passe pour la Plateforme de Stages.</p>
        <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
        <a href="${resetURL}" style="display: inline-block; padding: 10px 20px; background-color: #3b71ca; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0;">Réinitialiser mon mot de passe</a>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
        <p><strong>Lien de réinitialisation:</strong> ${resetURL}</p>
      </div>
    `;
    
    try {
      await sendEmail({
        email: user.email,
        subject: 'Réinitialisation de votre mot de passe - Plateforme de Stages',
        message
      });
      
      // En mode développement, on retourne aussi le token dans la réponse
      const response = {
        status: 'success',
        message: 'Si votre email est enregistré, vous recevrez un lien de réinitialisation.'
      };
      
      // En mode développement, on inclut le token pour faciliter les tests
      if (process.env.NODE_ENV === 'development') {
        response.debug = { resetToken, resetURL };
      }
      
      res.status(200).json(response);
    } catch (error) {
      // En cas d'erreur d'envoi d'email, réinitialiser les champs
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      
      return res.status(500).json({
        status: 'error',
        message: "Erreur lors de l'envoi de l'email. Veuillez réessayer plus tard."
      });
    }
  } catch (error) {
    console.error('Erreur dans forgotPassword:', error);
    res.status(500).json({
      status: 'error',
      message: 'Une erreur est survenue. Veuillez réessayer.'
    });
  }
};

// Réinitialisation du mot de passe
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    // 1. Hasher le token pour le comparer avec celui en base
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // 2. Trouver l'utilisateur avec un token valide et non expiré
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
      active: true
    });
    
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Le token de réinitialisation est invalide ou a expiré.'
      });
    }
    
    // 3. Mettre à jour le mot de passe
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();
    
    // 4. Envoyer un email de confirmation (optionnel)
    try {
      const message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b71ca;">Mot de passe modifié</h2>
          <p>Votre mot de passe a été modifié avec succès.</p>
          <p>Si vous n'êtes pas à l'origine de cette modification, veuillez contacter immédiatement l'administrateur.</p>
        </div>
      `;
      
      await sendEmail({
        email: user.email,
        subject: 'Confirmation de modification de mot de passe - Plateforme de Stages',
        message
      });
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email de confirmation:", emailError);
      // On ne bloque pas la réponse même si l'email de confirmation échoue
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Votre mot de passe a été réinitialisé avec succès.'
    });
  } catch (error) {
    console.error('Erreur dans resetPassword:', error);
    res.status(500).json({
      status: 'error',
      message: 'Une erreur est survenue lors de la réinitialisation du mot de passe.'
    });
  }
};

// Vérification de la validité du token
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    
    // Hasher le token pour le comparer avec celui en base
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Trouver l'utilisateur avec un token valide et non expiré
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
      active: true
    });
    
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Le token de réinitialisation est invalide ou a expiré.'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Token valide',
      data: {
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erreur dans verifyResetToken:', error);
    res.status(500).json({
      status: 'error',
      message: 'Une erreur est survenue lors de la vérification du token.'
    });
  }
};

// Middleware pour protéger les routes
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // 1. Vérifier si le token existe dans les headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ message: 'Vous n\'êtes pas connecté. Veuillez vous connecter pour accéder à cette ressource.' });
    }
    
    // 2. Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Vérifier si l'utilisateur existe toujours
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ message: 'Le token ne correspond à aucun utilisateur.' });
    }
    
    // 4. Vérifier si l'utilisateur a changé son mot de passe après l'émission du token
    // (Si vous ajoutez un champ passwordChangedAt dans le modèle User)
    
    // 5. Ajouter l'utilisateur à la requête
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide.' });
  }
};

// Middleware pour restreindre l'accès par rôle
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Vous n\'avez pas la permission d\'effectuer cette action.' });
    }
    next();
  };
};