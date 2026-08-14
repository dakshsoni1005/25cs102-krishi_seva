const mongoose = require("mongoose");

const marketWatchlistSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    cropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      default: null
    },
    cropName: {
      type: String,
      required: true
    },
    market: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate watchlist entries for the same farmer/crop/market combination
marketWatchlistSchema.index({ farmerId: 1, cropName: 1, market: 1 }, { unique: true });

module.exports = mongoose.model("MarketWatchlist", marketWatchlistSchema);
