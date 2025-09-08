const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  offerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  motivationLetter: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

// Empêche un étudiant de postuler 2 fois à la même offre
applicationSchema.index({ offerId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);