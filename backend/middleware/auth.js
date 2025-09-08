const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    
    // Vérifier si le token est dans les headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Si aucun token
    if (!token) {
      return res.status(401).json({ message: 'Accès non autorisé, token manquant' });
    }
    
    try {
      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Récupérer l'utilisateur sans le mot de passe
      req.user = await User.findById(decoded.id).select('-password');
      
      // Vérifier si l'utilisateur existe
      if (!req.user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }
      
      // Vérifier si le compte est actif
      if (!req.user.active) {
        return res.status(401).json({ message: 'Compte désactivé' });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token non valide' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Le rôle ${req.user.role} n'est pas autorisé à accéder à cette ressource` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };