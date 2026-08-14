const GovernmentAdvisory = require('../models/GovernmentAdvisory');
const { resolveDistrict } = require('../utils/resolve');

const getAdvisories = async (req, res) => {
  try {
    const { district } = req.query;
    let filter = {};

    if (district) {
      const resolvedDistrict = await resolveDistrict(district);
      if (!resolvedDistrict) {
        return res.status(404).json({
          success: false,
          message: `District '${district}' not found.`
        });
      }
      filter.district_id = resolvedDistrict._id;
    }

    const advisories = await GovernmentAdvisory.find(filter).populate('district_id', 'name region');
    return res.status(200).json({
      success: true,
      count: advisories.length,
      data: advisories
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching government advisories.'
    });
  }
};

module.exports = {
  getAdvisories
};
