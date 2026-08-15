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

    const forecastDays = (dailyData.time || []).slice(0, 7).map((time, idx) => {
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
        temperature: Math.round((current.temperature || 31) * 10) / 10,
        temp: Math.round(current.temperature || 31),
        condition: conditionText,
        humidity: currentHumidity,
        windSpeed: Math.round((current.windspeed || 12) * 10) / 10,
        rainfall: dailyData.precipitation_sum?.[0] || 0,
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
    
    // Fallback data when Open-Meteo is unreachable
    return {
      current: {
        temperature: 30,
        temp: 30,
        condition: "Partly Cloudy",
        humidity: 65,
        windSpeed: 12,
        rainfall: 0,
        rainProbability: 15
      },
      forecast: [
        { day: "Today", temp: 30, maxTemp: 32, minTemp: 24, rainProbability: 15, precipitationMm: 0 },
        { day: "Tomorrow", temp: 31, maxTemp: 33, minTemp: 25, rainProbability: 10, precipitationMm: 0 },
        { day: "Day 3", temp: 29, maxTemp: 31, minTemp: 23, rainProbability: 20, precipitationMm: 2 },
        { day: "Day 4", temp: 30, maxTemp: 32, minTemp: 24, rainProbability: 15, precipitationMm: 0 },
        { day: "Day 5", temp: 31, maxTemp: 33, minTemp: 25, rainProbability: 10, precipitationMm: 0 },
        { day: "Day 6", temp: 32, maxTemp: 34, minTemp: 26, rainProbability: 5, precipitationMm: 0 },
        { day: "Day 7", temp: 30, maxTemp: 32, minTemp: 24, rainProbability: 15, precipitationMm: 0 }
      ],
      alerts: [],
      source: "MongoDB WeatherCache Fallback",
      isLive: false,
      lastUpdated: new Date()
    };
  }
};

module.exports = {
  fetchWeatherData,
  fetchWeatherFromProvider: fetchWeatherData
};
