const mongoose = require('mongoose');

const GovernmentAdvisorySchema = new mongoose.Schema({
  district_id: { type: mongoose.Schema.Types.ObjectId, ref: 'District', required: true },
  type: { type: String, default: 'General' },
  level: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  message: { type: String, required: true }
}, { timestamps: true });

GovernmentAdvisorySchema.index({ district_id: 1, message: 1 }, { unique: true });

module.exports = mongoose.model('GovernmentAdvisory', GovernmentAdvisorySchema);
