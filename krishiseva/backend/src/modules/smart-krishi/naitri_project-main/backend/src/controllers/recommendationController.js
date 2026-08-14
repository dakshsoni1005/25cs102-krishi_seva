const recommendationService = require('../services/recommendationService');

const getRecommendation = async (req, res) => {
  try {
    const district = req.body.district || req.query.district;
    const crop = req.body.crop || req.query.crop;
    const season = req.body.season || req.query.season;

    if (!district || !crop) {
      return res.status(400).json({
        success: false,
        message: 'Both district and crop parameters are required (in body or query).'
      });
    }

    const recommendation = await recommendationService.getRecommendation(district, crop, season);
    if (recommendation.success === false) {
      return res.status(400).json(recommendation);
    }
    return res.status(200).json(recommendation);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'An error occurred during recommendation processing.'
    });
  }
};

module.exports = {
  getRecommendation
};
