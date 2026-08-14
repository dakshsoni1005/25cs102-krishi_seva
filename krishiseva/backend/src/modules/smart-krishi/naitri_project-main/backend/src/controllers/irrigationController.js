const Irrigation = require('../models/Irrigation');
const { resolveCrop } = require('../utils/resolve');

const getIrrigationByCrop = async (req, res) => {
  try {
    const { crop } = req.params;
    const resolvedCrop = await resolveCrop(crop);

    if (!resolvedCrop) {
      return res.status(404).json({
        success: false,
        message: `Crop '${crop}' not found.`
      });
    }

    const irrigation = await Irrigation.find({ crop_id: resolvedCrop._id }).populate('district_id', 'name region');
    return res.status(200).json({
      success: true,
      count: irrigation.length,
      crop: resolvedCrop.name,
      data: irrigation
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching irrigation details.'
    });
  }
};

module.exports = {
  getIrrigationByCrop
};
