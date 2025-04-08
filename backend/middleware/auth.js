const jwt = require('jsonwebtoken');

// Clé secrète JWT 
const JWT_SECRET = 'votre_clé_secrète';

// Middleware pour vérifier le JWT
exports.verifyToken = (req, res, next) => {
  // Récupérer le token du header d'autorisation
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ 
      status: 'error',
      message: 'Accès non autorisé. Token requis.' 
    });
  }
  
  try {
    // Vérifier le token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ 
      status: 'error',
      message: 'Token invalide ou expiré' 
    });
  }
};

// Créer un token JWT
exports.generateToken = (userData) => {
  return jwt.sign(
    userData,
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};