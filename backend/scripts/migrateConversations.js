const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
require('dotenv').config();

const migrateConversations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('Migration des conversations...');
    
    // Logique de migration ici
    
    console.log('Migration terminée avec succès');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
    process.exit(1);
  }
};

migrateConversations();