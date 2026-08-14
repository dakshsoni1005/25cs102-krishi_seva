const express = require('express');
const router = express.Router();
const pestController = require('../controllers/pestController');

router.get('/:crop', pestController.getPestsByCrop);

module.exports = router;
