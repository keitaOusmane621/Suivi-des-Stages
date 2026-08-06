const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "L'étudiant est requis"],
    },
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
      required: [true, "L'offre est requise"],
    },
    cv: {
      type: String,
      required: [true, 'Le CV est requis'],
    },
    motivationLetter: {
      type: String,
      required: [true, 'La lettre de motivation est requise'],
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Index unique sur (student, offer) pour éviter les doublons par étudiant
applicationSchema.index({ student: 1, offer: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);