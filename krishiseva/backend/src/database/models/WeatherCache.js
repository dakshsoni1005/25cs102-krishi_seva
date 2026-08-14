const mongoose = require("mongoose");

const weatherCacheSchema = new mongoose.Schema(
  {
    locationKey: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    district: {
      type: String,
      default: ""
    },
    taluka: {
      type: String,
      default: ""
    },
    current: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    forecast: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    alerts: {
      type: mongoose.Schema.Types.Mixed,
      default: []
    },
    source: {
      type: String,
      default: "Open-Meteo API"
    },
    fetchedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // MongoDB TTL index (automatically deletes document when expiresAt <= current time)
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("WeatherCache", weatherCacheSchema);
