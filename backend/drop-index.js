const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');

const dropIndex = async () => {
  try {
    await connectDB();
    
    // Supprimer l'index problématique
    await mongoose.connection.collection('applications').dropIndex('offer_1_student_1');
    console.log('✅ Index offer_1_student_1 supprimé avec succès');
    
    // Supprimer les documents avec des valeurs null
    const result = await mongoose.connection.collection('applications').deleteMany({
      $or: [
        { offerId: null },
        { studentId: null }
      ]
    });
    console.log(`✅ ${result.deletedCount} documents corrompus supprimés`);
    
    process.exit(0);
  } catch (error) {
    console.log('ℹ️ Index non trouvé ou déjà supprimé:', error.message);
    process.exit(0);
  }
};

dropIndex();