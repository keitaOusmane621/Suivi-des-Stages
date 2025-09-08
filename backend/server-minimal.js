const express = require('express');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de base
app.use(express.json());
const simpleAuthRoutes = require('./routes/simple-auth');
app.use('/api/simple-auth', simpleAuthRoutes);

// Route simple pour tester
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server minimal running on port ${PORT}`);
  console.log(`Test URL: http://localhost:${PORT}/api/test`);
});