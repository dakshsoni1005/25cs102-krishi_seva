const mongoose = require('mongoose');

const PestSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  affectedCrops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Crop' }],
  solution: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Pest', PestSchema);
