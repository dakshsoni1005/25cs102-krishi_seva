const MarketPrice = require('../models/MarketPrice');
const { resolveCrop } = require('../utils/resolve');

const getMarketPricesByCrop = async (req, res) => {
  try {
    const { crop } = req.params;
    const resolvedCrop = await resolveCrop(crop);

    if (!resolvedCrop) {
      return res.status(404).json({
        success: false,
        message: `Crop '${crop}' not found.`
      });
    }

    const prices = await MarketPrice.find({ crop_id: resolvedCrop._id }).populate('district_id', 'name region');
    return res.status(200).json({
      success: true,
      count: prices.length,
      crop: resolvedCrop.name,
      data: prices
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching market prices.'
    });
  }
};

module.exports = {
  getMarketPricesByCrop
};
