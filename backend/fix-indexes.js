const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');

const fixIndexes = async () => {
  try {
    await connectDB();
    
    // Supprimer l'index problématique
    await mongoose.connection.collection('companies').dropIndex('user_1');
    console.log('✅ Index user_1 supprimé avec succès');
    
    // Supprimer les documents avec userId: null
    const result = await mongoose.connection.collection('companies').deleteMany({ userId: null });
    console.log(`✅ ${result.deletedCount} documents corrompus supprimés`);
    
    process.exit(0);
  } catch (error) {
    console.log('ℹ️ Index non trouvé ou déjà supprimé:', error.message);
    process.exit(0);
  }
};

fixIndexes();