const mongoose = require('mongoose');

const MarketPriceSchema = new mongoose.Schema({
  crop_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
  district_id: { type: mongoose.Schema.Types.ObjectId, ref: 'District', required: true },
  pricePerQuintal: { type: Number, required: true },
  marketName: { type: String, required: true },
  dateReported: { type: Date, default: Date.now }
}, { timestamps: true });

MarketPriceSchema.index({ crop_id: 1, district_id: 1, marketName: 1 }, { unique: true });

module.exports = mongoose.model('MarketPrice', MarketPriceSchema);
