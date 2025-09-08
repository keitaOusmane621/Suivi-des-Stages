const Student = require('../models/Student');
const User = require('../models/User');

// Récupérer tous les étudiants
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('userId', 'email');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un étudiant par ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('userId', 'email');
    if (!student) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un étudiant
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un étudiant
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }

    // Supprimer aussi l'utilisateur associé
    await User.findByIdAndDelete(student.userId);
    await Student.findByIdAndDelete(req.params.id);

    res.json({ message: 'Étudiant supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};