const mongoose = require('mongoose');

const DistrictSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  region: { type: String, required: true },
  taluka: { type: String },
  coordinates: {
    lat: Number,
    lng: Number
  },
  suitableCrops: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('District', DistrictSchema);
