const mongoose = require("mongoose");

const pestScanSchema = new mongoose.Schema(
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
    imageUrl: {
      type: String,
      required: true
    },
    imagePublicId: {
      type: String,
      default: ""
    },
    detectedDisease: {
      type: String,
      required: true
    },
    detectedPest: {
      type: String,
      default: ""
    },
    confidence: {
      type: Number,
      required: true,
      min: [0, "Confidence cannot be less than 0"],
      max: [1, "Confidence cannot exceed 1 (100%)"]
    },
    severity: {
      type: String,
      enum: ["Low", "Moderate", "High", "Severe"],
      default: "Moderate"
    },
    symptoms: {
      type: [String],
      default: []
    },
    possibleCauses: {
      type: String,
      default: ""
    },
    treatment: {
      chemical: { type: String, default: "" },
      organic: { type: String, default: "" }
    },
    prevention: {
      type: [String],
      default: []
    },
    modelName: {
      type: String,
      default: "KrishiVision-V2"
    },
    modelVersion: {
      type: String,
      default: "2.4.1"
    },
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "completed"
    }
  },
  {
    timestamps: true
  }
);

// Indexes
pestScanSchema.index({ farmerId: 1, createdAt: -1 });

module.exports = mongoose.model("PestScan", pestScanSchema);
