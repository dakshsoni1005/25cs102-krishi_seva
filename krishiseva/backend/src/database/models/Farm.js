const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
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
    location: {
      type: String,
      default: ""
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
      default: "Medium Black Clay"
    },
    irrigationType: {
      type: String,
      default: "Drip Irrigation"
    },
    waterSource: {
      type: String,
      default: "Tubewell"
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    }
  },
  {
    timestamps: true
  }
);


module.exports = mongoose.model("Farm", farmSchema);
