const express = require('express');
const router = express.Router();
const soilController = require('../controllers/soilController');

router.get('/:district', soilController.getSoilByDistrict);

module.exports = router;
