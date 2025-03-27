const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controllers');

router.get('/jewelry', controllers.getJewelry);
router.get('/jewelry/:id', controllers.getJewelryById);

module.exports = router