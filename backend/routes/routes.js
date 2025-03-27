const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controllers');

router.get('/jewelry', controllers.getSneakers);
router.get('/jewelry/:id', controllers.getSneakerById);

module.exports = router