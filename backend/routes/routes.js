const express = require('express');
const router = express.Router();
const controllers = require('../controllers/home');

router.get('/jewelry', controllers.getJewelry);
router.get('/jewelry/:id', controllers.getJewelryById);


router.get('/men', controllers.getAllMen);
router.get('/women', controllers.getAllWomen);

// Type-based routes
router.get('/rings', controllers.getAllRings);
router.get('/bracelets', controllers.getAllBracelets);
router.get('/necklaces', controllers.getAllNecklaces);
router.get('/earrings', controllers.getAllEarrings);
router.get('/watches', controllers.getAllWatches);

// Combined gender and type routes
router.get('/women/rings', controllers.getWomenRings);
router.get('/men/rings', controllers.getMenRings);
router.get('/women/bracelets', controllers.getWomenBracelets);
router.get('/men/bracelets', controllers.getMenBracelets);
router.get('/women/necklaces', controllers.getWomenNecklaces);
router.get('/men/necklaces', controllers.getMenNecklaces);
router.get('/women/earrings', controllers.getWomenEarrings);
router.get('/men/earrings', controllers.getMenEarrings);
router.get('/women/watches', controllers.getWomenWatches);
router.get('/men/watches', controllers.getMenWatches);

module.exports = router