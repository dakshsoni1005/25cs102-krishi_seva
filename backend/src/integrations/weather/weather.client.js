const axios = require("axios");
const env = require("../../config/env");
const logger = require("../../utils/logger");

const fetchWeatherFromProvider = async (lat = 22.5694, lon = 72.9904) => {
  try {
    const url = `${env.WEATHER_API_URL}/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
    
    logger.info(`Fetching live weather from Open-Meteo for coordinates: ${lat}, ${lon}`);
    const res = await axios.get(url);
    const data = res.data;

    // Map Open-Meteo parameters to KrishiSeva standard
    const current = {
      temp: Math.round(data.current.temperature_2m),
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m),
      windDir: "SW", // open-meteo wind dir mapping could be added, defaults to SW
      rainProbability: data.daily.precipitation_probability_max[0] || 0,
      condition: (data.daily.precipitation_probability_max[0] || 0) > 70 ? "Heavy Rain" : "Partly Cloudy",
      uvIndex: 6,
      feelsLike: Math.round(data.current.temperature_2m) + 3,
      sunrise: "06:12 AM",
      sunset: "07:05 PM"
    };

    const days = ["Today", "Tomorrow", "Mon", "Tue", "Wed", "Thu", "Fri"];
    const forecast = data.daily.time.slice(0, 7).map((time, idx) => {
      const prob = data.daily.precipitation_probability_max[idx] || 0;
      let condition = "Mostly Sunny";
      let icon = "sun";
      
      if (prob > 80) {
        condition = "Heavy Rain";
        icon = "cloud-rain";
      } else if (prob > 50) {
        condition = "Partly Cloudy";
        icon = "cloud-sun-rain";
      } else if (prob > 20) {
        condition = "Showers";
        icon = "cloud-drizzle";
      }

      return {
        day: idx === 0 ? "Today" : idx === 1 ? "Tomorrow" : days[idx] || "Day",
        temp: Math.round(data.daily.temperature_2m_max[idx]),
        minTemp: Math.round(data.daily.temperature_2m_min[idx]),
        condition,
        rainProb: prob,
        icon
      };
    });

    const alerts = [];
    if (current.rainProbability > 80) {
      alerts.push({
        id: `alert-rain-${Date.now()}`,
        type: "rain",
        severity: "high",
        title: "Heavy Rainfall Warning",
        description: "Heavy thunder showers expected within the next 24 hours.",
        action: "Delay scheduled irrigation, ensure drainage channels are clear, and secure harvested bags."
      });
    }

    return {
      current,
      forecast,
      alerts
    };
  } catch (error) {
    logger.error(`Open-Meteo weather fetch failed: ${error.message}. Returning fallback forecasts.`);
    
    // Static Fallback
    return {
      current: {
        temp: 31,
        humidity: 78,
        windSpeed: 14,
        windDir: "SW",
        rainProbability: 85,
        condition: "Partly Cloudy",
        uvIndex: 6,
        feelsLike: 35,
        sunrise: "06:12 AM",
        sunset: "07:05 PM"
      },
      forecast: [
        { day: "Today", temp: 31, minTemp: 25, condition: "Partly Cloudy", rainProb: 85, icon: "cloud-sun-rain" },
        { day: "Tomorrow", temp: 28, minTemp: 24, condition: "Heavy Rain", rainProb: 95, icon: "cloud-rain" },
        { day: "Mon", temp: 29, minTemp: 24, condition: "Thunderstorms", rainProb: 90, icon: "cloud-lightning" },
        { day: "Tue", temp: 30, minTemp: 25, condition: "Showers", rainProb: 75, icon: "cloud-drizzle" },
        { day: "Wed", temp: 32, minTemp: 26, condition: "Mostly Sunny", rainProb: 20, icon: "sun" },
        { day: "Thu", temp: 33, minTemp: 26, condition: "Sunny", rainProb: 10, icon: "sun" },
        { day: "Fri", temp: 33, minTemp: 27, condition: "Sunny", rainProb: 15, icon: "sun" }
      ],
      alerts: [
        {
          id: "fallback-alert-1",
          type: "rain",
          severity: "high",
          title: "Heavy Rainfall Warning",
          description: "Heavy thunder showers expected in Anand district tomorrow.",
          action: "Delay irrigation for 24-48 hours. Postpone chemical fertilization application."
        }
      ]
    };
  }
};

module.exports = {
  fetchWeatherFromProvider
};
