const SoilData = require('../models/SoilData');
const { resolveDistrict } = require('../utils/resolve');

const getSoilByDistrict = async (req, res) => {
  try {
    const { district } = req.params;
    const resolvedDistrict = await resolveDistrict(district);

    if (!resolvedDistrict) {
      return res.status(404).json({
        success: false,
        message: `District '${district}' not found.`
      });
    }

    const soilData = await SoilData.findOne({ district_id: resolvedDistrict._id });
    if (!soilData) {
      return res.status(404).json({
        success: false,
        message: `Soil data not found for district '${resolvedDistrict.name}'.`
      });
    }

    return res.status(200).json({
      success: true,
      data: soilData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching soil data.'
    });
  }
};

module.exports = {
  getSoilByDistrict
};
