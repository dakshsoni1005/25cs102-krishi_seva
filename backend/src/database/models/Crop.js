const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Crop name is required"],
      unique: true,
      trim: true
    },
    localNames: {
      type: [String],
      default: []
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    season: {
      type: String,
      required: true,
      trim: true // Kharif, Rabi, Summer, Year-round
    },
    scientificName: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    commonDiseases: {
      type: [String],
      default: []
    },
    commonPests: {
      type: [String],
      default: []
    },
    recommendedSoilTypes: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);


module.exports = mongoose.model("Crop", cropSchema);
