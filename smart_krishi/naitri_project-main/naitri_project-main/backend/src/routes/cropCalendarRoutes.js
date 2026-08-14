const express = require('express');
const router = express.Router();
const cropCalendarController = require('../controllers/cropCalendarController');

router.get('/:crop', cropCalendarController.getCropCalendarByCrop);

module.exports = router;
