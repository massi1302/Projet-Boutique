// routes/auth.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Route pour l'inscription
router.post('/register', userController.register);

// Route pour la connexion
router.post('/login', userController.login);

// Route protégée pour récupérer les infos utilisateur
router.get('/me', authMiddleware.verifyToken, userController.getMe);

module.exports = router;