const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');

const checkIndexes = async () => {
  try {
    await connectDB();
    
    const indexes = await mongoose.connection.collection('applications').getIndexes();
    console.log('📋 Indexes sur la collection applications:');
    console.log(indexes);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

checkIndexes();