const express = require('express');
const router = express.Router();
const irrigationController = require('../controllers/irrigationController');

router.get('/:crop', irrigationController.getIrrigationByCrop);

module.exports = router;
