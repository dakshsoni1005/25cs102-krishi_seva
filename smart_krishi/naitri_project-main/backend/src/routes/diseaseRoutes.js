const express = require('express');
const router = express.Router();
const diseaseController = require('../controllers/diseaseController');

router.get('/:crop', diseaseController.getDiseasesByCrop);

module.exports = router;
