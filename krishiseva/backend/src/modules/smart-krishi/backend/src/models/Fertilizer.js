const mongoose = require('mongoose');

const FertilizerSchema = new mongoose.Schema({
  crop_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
  stage: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: String, required: true }
}, { timestamps: true });

FertilizerSchema.index({ crop_id: 1, stage: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Fertilizer', FertilizerSchema);
