const express = require('express');
const router = express.Router();
const governmentAdvisoryController = require('../controllers/governmentAdvisoryController');

router.get('/', governmentAdvisoryController.getAdvisories);

module.exports = router;
