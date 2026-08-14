const Disease = require('../models/Disease');
const { resolveCrop } = require('../utils/resolve');

const getDiseasesByCrop = async (req, res) => {
  try {
    const { crop } = req.params;
    const resolvedCrop = await resolveCrop(crop);

    if (!resolvedCrop) {
      return res.status(404).json({
        success: false,
        message: `Crop '${crop}' not found.`
      });
    }

    const diseases = await Disease.find({ affectedCrops: resolvedCrop._id });
    return res.status(200).json({
      success: true,
      count: diseases.length,
      crop: resolvedCrop.name,
      data: diseases
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching diseases.'
    });
  }
};

module.exports = {
  getDiseasesByCrop
};
