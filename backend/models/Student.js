const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: String,
  lastName: String,
  phone: String,
  education: String, // Filière
  skills: [String],
  cv: String, // Chemin vers le fichier ou lien
  profilePicture: String
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);