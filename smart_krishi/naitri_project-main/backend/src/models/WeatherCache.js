const mongoose = require('mongoose');

const ForecastDaySchema = new mongoose.Schema({
  day: { type: String, required: true },
  max: { type: Number },
  min: { type: Number },
  rain: { type: Number }
}, { _id: false });

const WeatherCacheSchema = new mongoose.Schema({
  district_id: { type: mongoose.Schema.Types.ObjectId, ref: 'District', required: true, unique: true },
  current: {
    temperature: { type: Number },
    humidity: { type: Number },
    rainfall: { type: Number },
    windSpeed: { type: Number },
    condition: { type: String },
    rainProbability: { type: Number, default: 0 }
  },
  forecast: [ForecastDaySchema]
}, { timestamps: true });

module.exports = mongoose.model('WeatherCache', WeatherCacheSchema);
