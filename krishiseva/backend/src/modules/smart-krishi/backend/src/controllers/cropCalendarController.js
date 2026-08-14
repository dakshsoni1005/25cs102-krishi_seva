const CropCalendar = require('../models/CropCalendar');
const { resolveCrop } = require('../utils/resolve');

const getCropCalendarByCrop = async (req, res) => {
  try {
    const { crop } = req.params;
    const resolvedCrop = await resolveCrop(crop);

    if (!resolvedCrop) {
      return res.status(404).json({
        success: false,
        message: `Crop '${crop}' not found.`
      });
    }

    const calendar = await CropCalendar.find({ crop_id: resolvedCrop._id }).populate('district_id', 'name region');
    return res.status(200).json({
      success: true,
      count: calendar.length,
      crop: resolvedCrop.name,
      data: calendar
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching crop calendar.'
    });
  }
};

module.exports = {
  getCropCalendarByCrop
};
