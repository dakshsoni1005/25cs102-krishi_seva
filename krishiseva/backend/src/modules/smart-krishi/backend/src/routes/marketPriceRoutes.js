const express = require('express');
const router = express.Router();
const marketPriceController = require('../controllers/marketPriceController');

router.get('/:crop', marketPriceController.getMarketPricesByCrop);

module.exports = router;
