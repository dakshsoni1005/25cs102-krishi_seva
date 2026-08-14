const axios = require('axios');
const WeatherCache = require('../models/WeatherCache');

const mapWeatherCode = (code) => {
  if (code === 0) return 'Clear Sky';
  if (code === 1) return 'Mainly Clear';
  if (code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if ([45, 48].includes(code)) return 'Fog';
  if ([51, 53, 55].includes(code)) return 'Drizzle';
  if ([56, 57].includes(code)) return 'Freezing Drizzle';
  if ([61, 63, 65].includes(code)) return 'Rainy';
  if ([66, 67].includes(code)) return 'Freezing Rain';
  if ([71, 73, 75].includes(code)) return 'Snowy';
  if (code === 77) return 'Snow Grains';
  if ([80, 81, 82].includes(code)) return 'Rain Showers';
  if ([85, 86].includes(code)) return 'Snow Showers';
  if (code === 95) return 'Thunderstorm';
  if ([96, 99].includes(code)) return 'Thunderstorm with Hail';
  return 'Cloudy';
};

const getLiveWeather = async (district) => {
  if (!district.coordinates || district.coordinates.lat === undefined || district.coordinates.lng === undefined) {
    throw new Error(`Missing coordinates for district '${district.name}'.`);
  }

  const { lat, lng } = district.coordinates;

  try {
    console.log(`Querying Open-Meteo API for ${district.name} (${lat}, ${lng})...`);
    
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lng,
        current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,rain,weather_code',
        daily: 'temperature_2m_max,temperature_2m_min,rain_sum,precipitation_probability_max',
        timezone: 'auto'
      },
      timeout: 5000
    });

    const data = response.data;
    const current = data.current;
    const daily = data.daily;

    const currentRainProbability = (daily && daily.precipitation_probability_max) ? daily.precipitation_probability_max[0] : 0;

    const liveWeather = {
      current: {
        temperature: current.temperature_2m || 0,
        humidity: current.relative_humidity_2m || 0,
        rainfall: current.rain || 0,
        windSpeed: current.wind_speed_10m || 0,
        condition: mapWeatherCode(current.weather_code),
        rainProbability: currentRainProbability
      },
      forecast: (daily.time || []).map((timeStr, i) => {
        let dayName = `Day ${i + 1}`;
        const dateObj = new Date(timeStr);
        if (i === 0) dayName = 'Today';
        else if (i === 1) dayName = 'Tomorrow';
        else dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

        return {
          day: dayName,
          max: daily.temperature_2m_max[i] || 0,
          min: daily.temperature_2m_min[i] || 0,
          rain: daily.rain_sum[i] || 0,
          rainProbability: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0
        };
      })
    };

    // Update database cache asynchronously
    WeatherCache.findOneAndUpdate(
      { district_id: district._id },
      {
        district_id: district._id,
        current: liveWeather.current,
        forecast: liveWeather.forecast
      },
      { upsert: true, new: true }
    ).catch(err => console.error('Failed to update weather cache:', err.message));

    return liveWeather;
  } catch (error) {
    console.warn(`Live Open-Meteo Weather API query failed for ${district.name}:`, error.message);

    try {
      // Database Fallback
      const cachedWeather = await WeatherCache.findOne({ district_id: district._id });
      if (cachedWeather) {
        return {
          current: cachedWeather.current,
          forecast: cachedWeather.forecast,
          isFallback: true
        };
      }
    } catch (dbErr) {
      console.warn('Database weather lookup failed, trying local dataset fallback:', dbErr.message);
    }

    // JSON Fallback
    try {
      const fs = require('fs');
      const path = require('path');
      const datasetPath = process.env.DATASET_PATH || path.join(__dirname, '../../../dataset.json/gujarat_agri_dataset_districtwise (1).json');
      if (fs.existsSync(datasetPath)) {
        const rawData = fs.readFileSync(datasetPath, 'utf8');
        const dataset = JSON.parse(rawData);
        const record = dataset.find(r => r.location.district.toLowerCase() === district.name.toLowerCase());
        if (record && record.weather) {
          return {
            current: record.weather.current,
            forecast: record.weather.forecast,
            isFallback: true
          };
        }
      }
    } catch (fsErr) {
      console.error('Failed to read local dataset weather fallback:', fsErr.message);
    }

    throw new Error(`Weather query failed and no fallback data available for district '${district.name}'.`);
  }
};

module.exports = {
  getLiveWeather
};
