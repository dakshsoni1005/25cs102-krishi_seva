const mongoose = require("mongoose");

const cropCycleSchema = new mongoose.Schema(
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
      required: true,
      trim: true
    },
    variety: {
      type: String,
      default: "Hybrid"
    },
    area: {
      type: Number,
      required: true
    },
    areaUnit: {
      type: String,
      enum: ["acres", "hectares"],
      default: "acres"
    },
    sowingDate: {
      type: Date,
      required: true
    },
    expectedHarvestDate: {
      type: Date,
      required: true
    },
    currentGrowthStage: {
      type: String,
      enum: [
        "land_preparation",
        "sowing",
        "germination",
        "vegetative",
        "flowering",
        "fruit_development",
        "maturity",
        "harvest"
      ],
      default: "sowing"
    },
    healthStatus: {
      type: String,
      enum: ["Good", "Alert", "Critical"],
      default: "Good"
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
      index: true
    },
    notes: {
      type: String,
      default: ""
    },
    timeline: [
      {
        stage: { type: String, required: true },
        status: { type: String, enum: ["completed", "active", "upcoming"], required: true },
        date: { type: Date, default: null }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Indexes
cropCycleSchema.index({ farmerId: 1, status: 1 });


module.exports = mongoose.model("CropCycle", cropCycleSchema);
