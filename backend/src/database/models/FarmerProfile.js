const mongoose = require("mongoose");

const farmerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      default: ""
    },
    language: {
      type: String,
      enum: ["en", "gu", "hi"],
      default: "en"
    },
    state: {
      type: String,
      required: true,
      default: "Gujarat"
    },
    district: {
      type: String,
      required: true,
      trim: true
    },
    taluka: {
      type: String,
      required: true,
      trim: true
    },
    village: {
      type: String,
      required: true,
      trim: true
    },
    farmSize: {
      type: Number,
      default: 5.0
    },
    farmSizeUnit: {
      type: String,
      enum: ["acres", "hectares"],
      default: "acres"
    },
    irrigationType: {
      type: String,
      default: "Rainfed"
    },
    primaryCrops: {
      type: [String],
      default: ["Cotton"]
    },
    soilType: {
      type: String,
      default: "Medium Black Clay"
    },
    profileCompletion: {
      type: Number,
      default: 85
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("FarmerProfile", farmerProfileSchema);
