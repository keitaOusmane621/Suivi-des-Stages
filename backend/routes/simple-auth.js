const express = require('express');
const router = express.Router();

// Simulez vos contrôleurs pour tester
const mockRegister = (req, res) => {
  res.json({ message: 'Register successful', user: { id: 1, email: req.body.email } });
};

const mockLogin = (req, res) => {
  res.json({ message: 'Login successful', token: 'mock-token-123' });
};

const mockProfile = (req, res) => {
  res.json({ user: { id: 1, email: 'test@example.com' } });
};

// Routes
router.post('/register', mockRegister);
router.post('/login', mockLogin);
router.get('/profile', mockProfile);

module.exports = router;