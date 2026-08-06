// controllers/authController.js
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const sendEmail = require('../utils/email');

// ============================================
// UTILITAIRES
// ============================================

// Générer un token JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Créer et envoyer le token en réponse
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Supprimer le mot de passe de la réponse
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        active: user.active,
        createdAt: user.createdAt,
      },
    },
  });
};

// ============================================
// 1. INSCRIPTION
// ============================================
exports.register = async (req, res) => {
  try {
    const { email, password, role, ...profileData } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Cet email est déjà utilisé.',
      });
    }

    // Créer l'utilisateur
    const user = await User.create({
      email,
      password,
      role: role || 'student',
    });

    // Créer le profil selon le rôle
    let profile;
    if (role === 'student') {
      profile = await Student.create({
        userId: user._id,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
      });
    } else if (role === 'company') {
      profile = await Company.create({
        userId: user._id,
        name: profileData.name,
        sector: profileData.sector,
      });
    }

    // Envoyer la réponse avec le token
    createSendToken(user, 201, res);
  } catch (error) {
    console.error('❌ Erreur register:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Erreur lors de l\'inscription.',
    });
  }
};

// ============================================
// 2. CONNEXION
// ============================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Vérifier si l'email et le mot de passe existent
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Veuillez fournir un email et un mot de passe.',
      });
    }

    // 2. Vérifier si l'utilisateur existe et récupérer le mot de passe
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Email ou mot de passe incorrect.',
      });
    }

    // 3. Vérifier si le compte est actif
    if (!user.active) {
      return res.status(401).json({
        status: 'error',
        message: 'Ce compte a été désactivé. Veuillez contacter l\'administrateur.',
      });
    }

    // 4. Envoyer le token
    createSendToken(user, 200, res);
  } catch (error) {
    console.error('❌ Erreur login:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la connexion.',
    });
  }
};

// ============================================
// 3. MOT DE PASSE OUBLIÉ
// ============================================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Veuillez fournir une adresse email.',
      });
    }

    // 1. Vérifier si l'utilisateur existe
    const user = await User.findOne({ email, active: true });

    // Pour des raisons de sécurité, on renvoie un message générique
    if (!user) {
      return res.status(200).json({
        status: 'success',
        message:
          'Si votre email est enregistré, vous recevrez un lien de réinitialisation.',
      });
    }

    // 2. Générer le token de réinitialisation
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3. Construire le lien de réinitialisation
    const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #3b71ca;">🔐 Réinitialisation de mot de passe</h2>
        <p>Bonjour,</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe pour <strong>StageTrack</strong>.</p>
        <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetURL}" style="display: inline-block; padding: 12px 30px; background-color: #3b71ca; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
            🔄 Réinitialiser mon mot de passe
          </a>
        </div>
        <p style="font-size: 0.9em; color: #666;">
          ⏰ Ce lien expirera dans <strong>1 heure</strong>.
        </p>
        <p style="font-size: 0.9em; color: #666;">
          Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.
        </p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
        <p style="font-size: 0.8em; color: #999;">
          Lien : <a href="${resetURL}" style="word-break: break-all;">${resetURL}</a>
        </p>
      </div>
    `;

    // 4. Envoyer l'email
    try {
      await sendEmail({
        to: user.email,
        subject: '🔐 Réinitialisation de votre mot de passe - StageTrack',
        html: message,
      });

      const response = {
        status: 'success',
        message:
          'Un email de réinitialisation vous a été envoyé. Vérifiez votre boîte de réception.',
      };

      // En mode développement, on retourne le token pour faciliter les tests
      if (process.env.NODE_ENV === 'development') {
        response.debug = { resetToken, resetURL };
      }

      res.status(200).json(response);
    } catch (emailError) {
      console.error('❌ Erreur envoi email:', emailError);

      // Réinitialiser les champs en cas d'échec
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        status: 'error',
        message:
          "Erreur lors de l'envoi de l'email. Veuillez réessayer plus tard.",
      });
    }
  } catch (error) {
    console.error('❌ Erreur forgotPassword:', error);
    res.status(500).json({
      status: 'error',
      message: 'Une erreur est survenue. Veuillez réessayer.',
    });
  }
};

// ============================================
// 4. RÉINITIALISATION DU MOT DE PASSE
// ============================================
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, passwordConfirm } = req.body;

    // 1. Vérifier que les mots de passe correspondent
    if (!password || !passwordConfirm) {
      return res.status(400).json({
        status: 'error',
        message: 'Veuillez fournir un mot de passe et sa confirmation.',
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({
        status: 'error',
        message: 'Les mots de passe ne correspondent pas.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Le mot de passe doit contenir au moins 6 caractères.',
      });
    }

    // 2. Hasher le token pour le comparer avec celui en base
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // 3. Trouver l'utilisateur avec un token valide et non expiré
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
      active: true,
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Le lien de réinitialisation est invalide ou a expiré.',
      });
    }

    // 4. Mettre à jour le mot de passe (le pre-save hook le hachera)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();

    // 5. Envoyer un email de confirmation (optionnel)
    try {
      const confirmMessage = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #22c55e;">✅ Mot de passe modifié</h2>
          <p>Bonjour,</p>
          <p>Votre mot de passe a été modifié avec succès sur <strong>StageTrack</strong>.</p>
          <p>Si vous n'êtes pas à l'origine de cette modification, veuillez contacter immédiatement l'administrateur.</p>
          <p style="color: #666; font-size: 0.9em;">Si tout est en ordre, vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
        </div>
      `;

      await sendEmail({
        to: user.email,
        subject: '✅ Confirmation de modification de mot de passe - StageTrack',
        html: confirmMessage,
      });
    } catch (emailError) {
      console.warn('⚠️ Email de confirmation non envoyé:', emailError.message);
      // On ne bloque pas la réponse si l'email échoue
    }

    res.status(200).json({
      status: 'success',
      message: 'Votre mot de passe a été réinitialisé avec succès.',
    });
  } catch (error) {
    console.error('❌ Erreur resetPassword:', error);
    res.status(500).json({
      status: 'error',
      message: 'Une erreur est survenue lors de la réinitialisation.',
    });
  }
};

// ============================================
// 5. VÉRIFICATION DU TOKEN DE RÉINITIALISATION
// ============================================
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    // Hasher le token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Vérifier si le token est valide
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
      active: true,
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Le lien de réinitialisation est invalide ou a expiré.',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Token valide',
      data: {
        email: user.email,
      },
    });
  } catch (error) {
    console.error('❌ Erreur verifyResetToken:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la vérification du token.',
    });
  }
};

// ============================================
// 6. DÉCONNEXION (côté client, on supprime le token)
// ============================================
exports.logout = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Déconnexion réussie.',
  });
};

// ============================================
// 7. RÉCUPÉRER LE PROFIL UTILISATEUR
// ============================================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Utilisateur non trouvé.',
      });
    }

    let profile = null;
    if (user.role === 'student') {
      profile = await Student.findOne({ userId: user._id });
    } else if (user.role === 'company') {
      profile = await Company.findOne({ userId: user._id });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
          active: user.active,
          createdAt: user.createdAt,
        },
        profile,
      },
    });
  } catch (error) {
    console.error('❌ Erreur getProfile:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération du profil.',
    });
  }
};

// ============================================
// 8. METTRE À JOUR LE PROFIL (étudiant/entreprise)
// ============================================
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Utilisateur non trouvé.',
      });
    }

    let profile;
    if (user.role === 'student') {
      profile = await Student.findOneAndUpdate(
        { userId: user._id },
        req.body,
        { new: true, runValidators: true }
      );
    } else if (user.role === 'company') {
      profile = await Company.findOneAndUpdate(
        { userId: user._id },
        req.body,
        { new: true, runValidators: true }
      );
    }

    res.status(200).json({
      status: 'success',
      data: { profile },
    });
  } catch (error) {
    console.error('❌ Erreur updateProfile:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la mise à jour du profil.',
    });
  }
};

// ============================================
// MIDDLEWARES D'AUTHENTIFICATION
// ============================================

// 1. Protéger les routes (vérifier le token JWT)
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Récupérer le token du header Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Vous devez être connecté pour accéder à cette ressource.',
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifier si l'utilisateur existe
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'L\'utilisateur associé à ce token n\'existe plus.',
      });
    }

    // Vérifier si le compte est actif
    if (!currentUser.active) {
      return res.status(401).json({
        status: 'error',
        message: 'Votre compte a été désactivé. Contactez l\'administrateur.',
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token invalide. Veuillez vous reconnecter.',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expiré. Veuillez vous reconnecter.',
      });
    }
    console.error('❌ Erreur protect:', error);
    res.status(401).json({
      status: 'error',
      message: 'Erreur d\'authentification.',
    });
  }
};

// 2. Restreindre l'accès selon les rôles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Vous n\'avez pas les droits pour effectuer cette action.',
      });
    }
    next();
  };
};