const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// Chargement des variables d'environnement
dotenv.config();

// Connexion à MongoDB
connectDB();

const app = express();

// ✅ Middleware file-upload (doit être AVANT les routes)
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './uploads/applications/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo
  abortOnLimit: true,
}));

// Middleware classiques
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Servir les fichiers statiques (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const offerRoutes = require('./routes/offers');
const applicationRoutes = require('./routes/applications');
const adminRoutes = require('./routes/admin');
const messageRoutes = require('./routes/messages');

app.use('/api/auth', authRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: '✅ API fonctionne !' });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));