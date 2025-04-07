const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// Routes pour l'authentification
router.post('/register', authController.register);
router.post('/login', authController.login);



// Route protégée d'exemple
router.get('/profile', authController.protect, (req, res) => {
  res.sendFile('profile.html', { root: '../frontend/templates' });
});

module.exports = router;