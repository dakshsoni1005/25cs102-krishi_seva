const mongoose = require('mongoose');

const CropCalendarSchema = new mongoose.Schema({
  crop_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
  district_id: { type: mongoose.Schema.Types.ObjectId, ref: 'District', required: true },
  season: { type: String, required: true },
  duration: { type: String }
}, { timestamps: true });

CropCalendarSchema.index({ crop_id: 1, district_id: 1 }, { unique: true });

module.exports = mongoose.model('CropCalendar', CropCalendarSchema);
