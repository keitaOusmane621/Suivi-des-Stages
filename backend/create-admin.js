const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const connectDB = require('./config/db');

const createAdmin = async () => {
  try {
    await connectDB();
    
    // Vérifier si admin existe déjà
    const existingAdmin = await User.findOne({ email: 'admin@stagetrack.com' });
    if (existingAdmin) {
      console.log('✅ Admin existe déjà');
      process.exit(0);
    }
    
    // Créer l'admin
    const admin = await User.create({
      email: 'admin@stagetrack.com',
      password: 'admin123',
      role: 'admin'
    });
    
    console.log('✅ Admin créé avec succès');
    console.log('Email: admin@stagetrack.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

createAdmin();