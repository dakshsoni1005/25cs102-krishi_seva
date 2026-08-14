const { fetchWeatherFromProvider } = require("../../integrations/weather/weather.client");
const WeatherCache = require("../../database/models/WeatherCache");
const FarmerProfile = require("../../database/models/FarmerProfile");
const logger = require("../../utils/logger");

const gujaratDistrictCoordinates = {
  "Ahmedabad": { lat: 23.0225, lon: 72.5714 },
  "Amreli": { lat: 21.6032, lon: 71.2221 },
  "Anand": { lat: 22.5694, lon: 72.9904 },
  "Aravalli": { lat: 23.5186, lon: 73.2325 },
  "Banaskantha": { lat: 24.1724, lon: 72.4346 },
  "Bharuch": { lat: 21.7051, lon: 72.9959 },
  "Bhavnagar": { lat: 21.7645, lon: 72.1519 },
  "Botad": { lat: 22.1704, lon: 71.6685 },
  "Chhota Udepur": { lat: 22.3108, lon: 74.0125 },
  "Dahod": { lat: 22.8347, lon: 74.2565 },
  "Dang": { lat: 20.8167, lon: 73.7000 },
  "Devbhoomi Dwarka": { lat: 22.2393, lon: 68.9678 },
  "Gandhinagar": { lat: 23.2156, lon: 72.6369 },
  "Gir Somnath": { lat: 20.9008, lon: 70.3644 },
  "Jamnagar": { lat: 22.4707, lon: 70.0577 },
  "Junagadh": { lat: 21.5222, lon: 70.4579 },
  "Kachchh": { lat: 23.2504, lon: 69.6630 },
  "Kheda": { lat: 22.7500, lon: 72.6833 },
  "Mahisagar": { lat: 23.1672, lon: 73.5583 },
  "Mehsana": { lat: 23.5880, lon: 72.3693 },
  "Morbi": { lat: 22.8173, lon: 70.8370 },
  "Narmada": { lat: 21.8719, lon: 73.5042 },
  "Navsari": { lat: 20.9467, lon: 72.9520 },
  "Panchmahal": { lat: 22.7744, lon: 73.6146 },
  "Patan": { lat: 23.8493, lon: 72.1266 },
  "Porbandar": { lat: 21.6417, lon: 69.6293 },
  "Rajkot": { lat: 22.3039, lon: 70.8022 },
  "Sabarkantha": { lat: 23.5979, lon: 72.9698 },
  "Surat": { lat: 21.1702, lon: 72.8311 },
  "Surendranagar": { lat: 22.7274, lon: 71.6370 },
  "Tapi": { lat: 21.1167, lon: 73.4000 },
  "Vadodara": { lat: 22.3072, lon: 73.1812 },
  "Valsad": { lat: 20.6100, lon: 72.9300 }
};

const getWeatherData = async (farmerId, targetDistrict = null) => {
  const profile = await FarmerProfile.findOne({ userId: farmerId });
  
  let districtName = targetDistrict || (profile ? profile.district : "Anand") || "Anand";
  let lat = 22.5694;
  let lon = 72.9904;

  const coords = gujaratDistrictCoordinates[districtName];
  if (coords) {
    lat = coords.lat;
    lon = coords.lon;
  }

  const locationKey = `Gujarat_${districtName}`;

  // Check cache database
  const now = new Date();
  const cached = await WeatherCache.findOne({ locationKey, expiresAt: { $gt: now } });
  
  if (cached) {
    logger.info(`Serving cached weather data for location: ${locationKey}`);
    return {
      current: cached.current,
      forecast: cached.forecast,
      alerts: cached.alerts,
      source: "Open-Meteo Cache",
      isLive: true,
      lastUpdated: cached.updatedAt
    };
  }

  // Call Open-Meteo client integration
  const weather = await fetchWeatherFromProvider(lat, lon);

  // Save to cache with 2-hour expiration
  try {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2);
    
    await WeatherCache.findOneAndUpdate(
      { locationKey },
      {
        latitude: lat,
        longitude: lon,
        current: weather.current,
        forecast: weather.forecast,
        alerts: weather.alerts,
        expiresAt
      },
      { upsert: true, new: true }
    );
  } catch (cacheErr) {
    logger.error(`Failed to cache weather data: ${cacheErr.message}`);
  }

  return weather;
};

const getWeatherAlerts = async (farmerId) => {
  const weather = await getWeatherData(farmerId);
  return weather.alerts;
};

module.exports = {
  getWeatherData,
  getWeatherAlerts,
  gujaratDistrictCoordinates
};
