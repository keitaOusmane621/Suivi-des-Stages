// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'L\'email est requis'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Veuillez entrer une adresse email valide'],
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est requis'],
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
      select: false, // Ne pas inclure par défaut dans les requêtes
    },
    role: {
      type: String,
      required: true,
      enum: ['student', 'company', 'admin'],
      default: 'student',
    },
    active: {
      type: Boolean,
      default: true,
    },
    // Champs pour la réinitialisation du mot de passe
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    // Champ pour la sécurité (mot de passe changé après)
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============================================
// MIDDLEWARE (pre-save hooks)
// ============================================

// Hacher le mot de passe avant de sauvegarder
userSchema.pre('save', async function (next) {
  // Ne hacher que si le mot de passe a été modifié
  if (!this.isModified('password')) return next();

  // Hacher avec bcrypt (coût: 12)
  this.password = await bcrypt.hash(this.password, 12);

  // Mettre à jour la date de changement de mot de passe
  this.passwordChangedAt = Date.now() - 1000; // Léger décalage pour éviter les problèmes de JWT

  next();
});

// ============================================
// MÉTHODES D'INSTANCE
// ============================================

// 1. Vérifier si le mot de passe est correct
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// 2. Générer un token de réinitialisation
userSchema.methods.createPasswordResetToken = function () {
  // Générer un token aléatoire
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hasher le token et le stocker en base (sécurisé)
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Expiration dans 1 heure
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000;

  // Retourner le token non hashé (pour l'envoyer par email)
  return resetToken;
};

// 3. Vérifier si le token de réinitialisation est valide
userSchema.methods.isResetTokenValid = function () {
  return this.resetPasswordExpires > Date.now();
};

// 4. Nettoyer les champs de réinitialisation après utilisation
userSchema.methods.clearResetToken = function () {
  this.resetPasswordToken = undefined;
  this.resetPasswordExpires = undefined;
  return this;
};

// 5. Vérifier si le mot de passe a été changé après la génération du token JWT
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// ============================================
// EXPORT
// ============================================
module.exports = mongoose.model('User', userSchema);