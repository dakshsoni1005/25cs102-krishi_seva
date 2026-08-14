const express = require('express');
const router = express.Router();
const fertilizerController = require('../controllers/fertilizerController');

router.get('/:crop', fertilizerController.getFertilizersByCrop);

module.exports = router;
