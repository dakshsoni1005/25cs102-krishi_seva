const mongoose = require('mongoose');

const DiseaseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  affectedCrops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Crop' }],
  symptoms: [{ type: String }],
  solution: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Disease', DiseaseSchema);
