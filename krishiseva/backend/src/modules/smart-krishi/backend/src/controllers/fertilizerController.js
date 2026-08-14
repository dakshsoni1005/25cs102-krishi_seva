const Fertilizer = require('../models/Fertilizer');
const { resolveCrop } = require('../utils/resolve');

const getFertilizersByCrop = async (req, res) => {
  try {
    const { crop } = req.params;
    const resolvedCrop = await resolveCrop(crop);

    if (!resolvedCrop) {
      return res.status(404).json({
        success: false,
        message: `Crop '${crop}' not found.`
      });
    }

    const fertilizers = await Fertilizer.find({ crop_id: resolvedCrop._id });
    return res.status(200).json({
      success: true,
      count: fertilizers.length,
      crop: resolvedCrop.name,
      data: fertilizers
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching fertilizer recommendations.'
    });
  }
};

module.exports = {
  getFertilizersByCrop
};
