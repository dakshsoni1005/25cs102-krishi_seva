const mongoose = require("mongoose");

const marketPriceSchema = new mongoose.Schema(
  {
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      default: null
    },
    cropName: {
      type: String,
      required: true,
      index: true
    },
    market: {
      type: String,
      required: true,
      index: true
    },
    district: {
      type: String,
      required: true,
      index: true
    },
    state: {
      type: String,
      required: true,
      default: "Gujarat"
    },
    minPrice: {
      type: Number,
      required: true
    },
    maxPrice: {
      type: Number,
      required: true
    },
    modalPrice: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      default: "quintal"
    },
    currency: {
      type: String,
      default: "INR"
    },
    date: {
      type: Date,
      required: true
    },
    source: {
      type: String,
      required: true,
      default: "APMC Market Feed"
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes
marketPriceSchema.index({ cropName: 1, market: 1, date: -1 });
marketPriceSchema.index({ district: 1, date: -1 });
// Compound unique constraint to prevent seed duplicate injections
marketPriceSchema.index({ cropName: 1, market: 1, date: 1, source: 1 }, { unique: true });

module.exports = mongoose.model("MarketPrice", marketPriceSchema);
