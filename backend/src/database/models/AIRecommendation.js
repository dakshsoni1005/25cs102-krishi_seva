const mongoose = require("mongoose");

const aiRecommendationSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
      default: null,
      index: true
    },
    cropCycleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CropCycle",
      default: null,
      index: true
    },
    type: {
      type: String,
      enum: ["irrigation", "fertilizer", "pest", "disease", "weather", "crop", "market", "harvest", "government"],
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    action: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium"
    },
    source: {
      type: String,
      enum: ["rule_engine", "ai", "hybrid"],
      default: "rule_engine"
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    expiresAt: {
      type: Date,
      default: null
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Indexes
aiRecommendationSchema.index({ farmerId: 1, createdAt: -1 });
aiRecommendationSchema.index({ farmerId: 1, isRead: 1 });

module.exports = mongoose.model("AIRecommendation", aiRecommendationSchema);
