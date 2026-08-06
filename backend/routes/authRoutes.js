// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  logout,
  getProfile,
  updateProfile,
  protect,
} = require('../controllers/authController');

// ============================================
// ROUTES PUBLIQUES
// ============================================

// Inscription
router.post('/register', register);

// Connexion
router.post('/login', login);

// Mot de passe oublié
router.post('/forgot-password', forgotPassword);

// Réinitialisation du mot de passe
router.post('/reset-password/:token', resetPassword);

// Vérification du token
router.get('/verify-reset-token/:token', verifyResetToken);

// Déconnexion
router.get('/logout', logout);

// ============================================
// ROUTES PROTÉGÉES (authentification requise)
// ============================================

// Profil utilisateur
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Route de test d'authentification
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { user: req.user },
  });
});

module.exports = router;