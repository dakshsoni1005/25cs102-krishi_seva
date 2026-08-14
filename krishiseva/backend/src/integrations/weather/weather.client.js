const axios = require("axios");
const env = require("../../config/env");
const logger = require("../../utils/logger");

const weatherCodeMap = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Depositing Rime Fog",
  51: "Light Drizzle",
  53: "Moderate Drizzle",
  55: "Dense Drizzle",
  61: "Slight Rain",
  63: "Moderate Rain",
  65: "Heavy Rain",
  80: "Slight Rain Showers",
  81: "Moderate Rain Showers",
  82: "Violent Rain Showers",
  95: "Thunderstorm"
};

const fetchWeatherData = async (latitude = 22.5694, longitude = 72.9904) => {
  const startTime = Date.now();
  const baseUrl = env.WEATHER_API_URL || "https://api.open-meteo.com";
  
  try {
    const url = `${baseUrl}/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;

    const response = await axios.get(url, { timeout: 8000 });
    const latency = Date.now() - startTime;
    logger.info(`Open-Meteo Weather API query successful (${latitude}, ${longitude}) in ${latency}ms`);

    const data = response.data;
    const current = data.current_weather || {};
    const dailyData = data.daily || {};
    const hourlyData = data.hourly || {};

    const conditionText = weatherCodeMap[current.weathercode] || "Partly Cloudy";
    const currentRainProb = hourlyData.precipitation_probability ? hourlyData.precipitation_probability[0] : 15;
    const currentHumidity = hourlyData.relative_humidity_2m ? hourlyData.relative_humidity_2m[0] : 62;

    const forecastDays = (dailyData.time || []).slice(0, 5).map((time, idx) => {
      const dateObj = new Date(time);
      const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
      return {
        day: dayName,
        date: time,
        maxTemp: Math.round(dailyData.temperature_2m_max?.[idx] || 32),
        minTemp: Math.round(dailyData.temperature_2m_min?.[idx] || 22),
        rainProbability: dailyData.precipitation_probability_max?.[idx] || 10,
        precipitationMm: dailyData.precipitation_sum?.[idx] || 0
      };
    });

    const alerts = [];
    if (currentRainProb > 70) {
      alerts.push({
        id: "alert-rain",
        title: "High Precipitation Expected",
        message: `Rain probability is ${currentRainProb}%. Delay spraying and drip irrigation cycles.`,
        priority: "high"
      });
    }
    if (current.temperature > 38) {
      alerts.push({
        id: "alert-heat",
        title: "Extreme Heat Stress Warning",
        message: `Temperature reached ${current.temperature}°C. Ensure crop hydration.`,
        priority: "medium"
      });
    }

    return {
      current: {
        temp: Math.round(current.temperature || 31),
        condition: conditionText,
        humidity: currentHumidity,
        windSpeed: `${Math.round(current.windspeed || 12)} km/h`,
        rainProbability: currentRainProb
      },
      forecast: forecastDays,
      alerts,
      source: "Open-Meteo",
      isLive: true,
      lastUpdated: new Date()
    };
  } catch (error) {
    const latency = Date.now() - startTime;
    logger.error(`Open-Meteo Weather API Call Failed (${latency}ms): ${error.message}`);
    
    const err = new Error("Weather service is temporarily unavailable.");
    err.statusCode = 503;
    err.code = "WEATHER_SERVICE_UNAVAILABLE";
    throw err;
  }
};

module.exports = {
  fetchWeatherData,
  fetchWeatherFromProvider: fetchWeatherData
};
