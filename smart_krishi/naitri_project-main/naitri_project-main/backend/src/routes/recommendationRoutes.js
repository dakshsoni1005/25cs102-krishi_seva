const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');

router.get('/', recommendationController.getRecommendation);
router.post('/', recommendationController.getRecommendation);

module.exports = router;
