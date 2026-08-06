const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const User = require("./models/User");

const createAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@stagetrack.com";

    // Vérifier si l'administrateur existe déjà
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("✅ L'administrateur existe déjà.");
      process.exit(0);
    }

    // Création de l'administrateur
    await User.create({
      email: adminEmail,
      password: "admin123",
      role: "admin",
    });

    console.log("=================================");
    console.log("✅ Administrateur créé avec succès");
    console.log("Email    : admin@stagetrack.com");
    console.log("Password : admin123");
    console.log("=================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur :", error);
    process.exit(1);
  }
};

createAdmin();