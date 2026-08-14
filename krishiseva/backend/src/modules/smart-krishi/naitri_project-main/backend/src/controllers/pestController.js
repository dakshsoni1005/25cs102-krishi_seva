const Pest = require('../models/Pest');
const { resolveCrop } = require('../utils/resolve');

const getPestsByCrop = async (req, res) => {
  try {
    const { crop } = req.params;
    const resolvedCrop = await resolveCrop(crop);

    if (!resolvedCrop) {
      return res.status(404).json({
        success: false,
        message: `Crop '${crop}' not found.`
      });
    }

    const pests = await Pest.find({ affectedCrops: resolvedCrop._id });
    return res.status(200).json({
      success: true,
      count: pests.length,
      crop: resolvedCrop.name,
      data: pests
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching pests.'
    });
  }
};

module.exports = {
  getPestsByCrop
};
