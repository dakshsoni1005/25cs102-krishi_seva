const mongoose = require("mongoose");

const soilProfileSchema = new mongoose.Schema(
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
    region: {
      type: String,
      enum: ["Central Gujarat", "Saurashtra", "North Gujarat", "South Gujarat", "Kachchh"],
      required: true
    },
    state: {
      type: String,
      required: true,
      default: "Gujarat"
    },
    district: {
      type: String,
      required: true
    },
    taluka: {
      type: String,
      required: true
    },
    village: {
      type: String,
      required: true
    },
    soilType: {
      type: String,
      required: true
    },
    ph: {
      type: Number,
      required: true,
      min: [0, "pH cannot be less than 0"],
      max: [14, "pH cannot be more than 14"]
    },
    nitrogen: {
      type: Number, // kg/ha
      required: true
    },
    phosphorus: {
      type: Number, // kg/ha
      required: true
    },
    potassium: {
      type: Number, // kg/ha
      required: true
    },
    organicCarbon: {
      type: Number, // %
      required: true
    },
    moisture: {
      type: Number, // %
      required: true,
      min: [0, "Moisture percentage cannot be negative"],
      max: [100, "Moisture percentage cannot exceed 100"]
    },
    healthScore: {
      type: Number,
      required: true,
      min: [0, "Health score cannot be less than 0"],
      max: [100, "Health score cannot exceed 100"],
      default: 75
    },
    source: {
      type: String,
      default: "Government Soil Testing Lab"
    },
    testedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Indexes
soilProfileSchema.index({ district: 1, taluka: 1 });

module.exports = mongoose.model("SoilProfile", soilProfileSchema);
