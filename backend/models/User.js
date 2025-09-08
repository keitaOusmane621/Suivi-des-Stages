const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // Ajout de crypto pour générer les tokens

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    required: true,
    enum: ['student', 'company', 'admin']
  },
  active: {
    type: Boolean,
    default: true
  },
  // Champs ajoutés pour la réinitialisation du mot de passe
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

// Hacher le mot de passe avant de sauvegarder l'utilisateur
userSchema.pre('save', async function(next) {
  // Ne hacher le mot de passe que s'il a été modifié (ou est nouveau)
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Méthode pour comparer les mots de passe
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Méthode pour générer un token de réinitialisation de mot de passe
userSchema.methods.createPasswordResetToken = function() {
  // 1. Générer un token aléatoire
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // 2. Hasher le token et le sauvegarder dans la base de données
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // 3. Définir une date d'expiration (1 heure)
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
  
  // 4. Retourner le token non hashé (pour l'envoyer par email)
  return resetToken;
};

// Méthode pour vérifier si le token de réinitialisation est valide
userSchema.methods.isResetTokenValid = function() {
  return this.resetPasswordExpires > Date.now();
};

// Méthode pour nettoyer les champs de réinitialisation après utilisation
userSchema.methods.clearResetToken = function() {
  this.resetPasswordToken = undefined;
  this.resetPasswordExpires = undefined;
  return this;
};

module.exports = mongoose.model('User', userSchema);