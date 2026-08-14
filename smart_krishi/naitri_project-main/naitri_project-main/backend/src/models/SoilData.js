const mongoose = require('mongoose');

const SoilDataSchema = new mongoose.Schema({
  district_id: { type: mongoose.Schema.Types.ObjectId, ref: 'District', required: true },
  type: { type: String, required: true },
  texture: { type: String },
  color: { type: String },
  ph: { type: String },
  npk: {
    nitrogen: { type: String, default: 'Medium' },
    phosphorus: { type: String, default: 'Medium' },
    potassium: { type: String, default: 'Medium' }
  },
  organicCarbon: { type: String },
  drainage: { type: String }
}, { timestamps: true });

SoilDataSchema.index({ district_id: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('SoilData', SoilDataSchema);
