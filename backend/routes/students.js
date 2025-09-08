const express = require('express');
const { getAllStudents, getStudentById, updateStudent, deleteStudent } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/', protect, authorize('admin'), getAllStudents);
router.get('/:id', protect, getStudentById);
router.put('/:id', protect, updateStudent);
router.delete('/:id', protect, authorize('admin'), deleteStudent);

module.exports = router;