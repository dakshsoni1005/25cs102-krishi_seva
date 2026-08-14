const mongoose = require("mongoose");

const recommendedCropSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  suitabilityPercentage: { type: Number, required: true, min: 0, max: 100 },
  reason: { type: String, default: "" }
});

const fertilizerRecommendationSchema = new mongoose.Schema({
  fertilizerName: { type: String, required: true },
  dosage: { type: String, required: true },
  timing: { type: String, required: true }
});

const soilAdvisorySchema = new mongoose.Schema(
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
    soilProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SoilProfile",
      required: true,
      unique: true
    },
    recommendedCrops: [recommendedCropSchema],
    fertilizerRecommendations: [fertilizerRecommendationSchema],
    soilImprovement: {
      type: [String],
      default: []
    },
    irrigationAdvice: {
      type: String,
      default: ""
    },
    generatedBy: {
      type: String,
      enum: ["rule_engine", "ai", "hybrid"],
      default: "rule_engine"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("SoilAdvisory", soilAdvisorySchema);
