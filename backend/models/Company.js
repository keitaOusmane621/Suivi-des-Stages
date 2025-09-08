const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    // NE METTEZ PAS unique: true ici
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  sector: String,
  address: String,
  website: String,
  logo: String
}, { timestamps: true });

// SUPPRIMEZ cette ligne si elle existe :
// companySchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('Company', companySchema);