const { fetchWeatherFromProvider } = require("../../integrations/weather/weather.client");
const WeatherCache = require("../../database/models/WeatherCache");
const FarmerProfile = require("../../database/models/FarmerProfile");
const logger = require("../../utils/logger");

const getWeatherData = async (farmerId) => {
  // 1. Get farmer coordinates from profile or default to Anand coordinates
  const profile = await FarmerProfile.findOne({ userId: farmerId });
  
  let lat = 22.5694;
  let lon = 72.9904;
  let locationKey = "Anand_Hadgud";

  if (profile) {
    locationKey = `${profile.state || "Gujarat"}_${profile.district || "Anand"}_${profile.village || "Hadgud"}`;
    // Simple coordinate mapping dictionary for seeded Gujarat districts
    const coordinatesMap = {
      "Anand": { lat: 22.5694, lon: 72.9904 },
      "Rajkot": { lat: 22.3039, lon: 70.8022 },
      "Patan": { lat: 23.8493, lon: 72.1266 },
      "Surat": { lat: 21.1702, lon: 72.8311 },
      "Kachchh": { lat: 23.2504, lon: 69.6630 }
    };
    const coords = coordinatesMap[profile.district];
    if (coords) {
      lat = coords.lat;
      lon = coords.lon;
    }
  }

  // 2. Query cache database
  const now = new Date();
  const cached = await WeatherCache.findOne({ locationKey, expiresAt: { $gt: now } });
  
  if (cached) {
    logger.info(`Serving cached weather data for location: ${locationKey}`);
    return {
      current: cached.current,
      forecast: cached.forecast,
      alerts: cached.alerts
    };
  }

  // 3. Call Open-Meteo client integration
  const weather = await fetchWeatherFromProvider(lat, lon);

  // 4. Save to cache with 1-hour expiration
  try {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1-hour TTL
    
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
  getWeatherAlerts
};
