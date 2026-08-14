const mongoose = require('mongoose');

const CropRequirementSchema = new mongoose.Schema({
  crop_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true, unique: true },
  suitableSoils: [{ type: String }],
  npkRequirement: {
    nitrogen: { type: String, default: 'Medium' },
    phosphorus: { type: String, default: 'Medium' },
    potassium: { type: String, default: 'Medium' }
  }
}, { timestamps: true });

module.exports = mongoose.model('CropRequirement', CropRequirementSchema);
