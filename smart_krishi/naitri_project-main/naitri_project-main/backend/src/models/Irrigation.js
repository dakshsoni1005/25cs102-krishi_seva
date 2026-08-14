const mongoose = require('mongoose');

const IrrigationSchema = new mongoose.Schema({
  crop_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
  district_id: { type: mongoose.Schema.Types.ObjectId, ref: 'District', required: true },
  frequency: { type: String, required: true },
  waterRequirement: { type: String, required: true },
  nextIrrigation: { type: String }
}, { timestamps: true });

IrrigationSchema.index({ crop_id: 1, district_id: 1 }, { unique: true });

module.exports = mongoose.model('Irrigation', IrrigationSchema);
