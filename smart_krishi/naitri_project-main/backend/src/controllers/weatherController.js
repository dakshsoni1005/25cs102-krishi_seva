const WeatherCache = require('../models/WeatherCache');
const { resolveDistrict } = require('../utils/resolve');

const getWeatherByDistrict = async (req, res) => {
  try {
    const { district } = req.params;
    const resolvedDistrict = await resolveDistrict(district);

    if (!resolvedDistrict) {
      return res.status(404).json({
        success: false,
        message: `District '${district}' not found.`
      });
    }

    const weather = await WeatherCache.findOne({ district_id: resolvedDistrict._id });
    if (!weather) {
      return res.status(404).json({
        success: false,
        message: `Weather cache not found for district '${resolvedDistrict.name}'.`
      });
    }

    return res.status(200).json({
      success: true,
      district: resolvedDistrict.name,
      data: weather
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching weather data.'
    });
  }
};

module.exports = {
  getWeatherByDistrict
};
