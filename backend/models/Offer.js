const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  domain: { type: String, required: true },
  location: { type: String, required: true },
  duration: { type: String, required: true },
  skillsRequired: [String],
  remuneration: { type: Number, min: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);