const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Clé secrète pour JWT - À définir dans un fichier .env en production
const JWT_SECRET = 'luce_preziosa_secret_key';

// Fonction pour créer un token JWT
const createToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '7d' // Token valide pour 7 jours
  });
};

// Contrôleur pour l'inscription d'un nouvel utilisateur
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Cet email est déjà utilisé'
      });
    }

    // Créer un nouvel utilisateur
    const newUser = new User({
      firstName,
      lastName,
      email,
      password
    });

    // Sauvegarder l'utilisateur dans la base de données
    await newUser.save();

    // Créer un token JWT
    const token = createToken(newUser._id);

    // Envoyer le token et les infos utilisateur (sans le mot de passe)
    res.status(201).json({
      status: 'success',
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      status: 'error',
      message: 'Une erreur est survenue lors de l\'inscription'
    });
  }
};

// Contrôleur pour la connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si le mot de passe est correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Créer un token JWT
    const token = createToken(user._id);

    // Envoyer le token et les infos utilisateur
    res.status(200).json({
      status: 'success',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      status: 'error',
      message: 'Une erreur est survenue lors de la connexion'
    });
  }
};

// Middleware pour protéger les routes
exports.protect = async (req, res, next) => {
  try {
    // Vérifier si le token existe
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Vous n\'êtes pas connecté. Veuillez vous connecter pour accéder à cette ressource.'
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Vérifier si l'utilisateur existe toujours
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'L\'utilisateur associé à ce token n\'existe plus.'
      });
    }

    // Mettre l'utilisateur dans la requête
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token invalide ou expiré'
    });
  }
};