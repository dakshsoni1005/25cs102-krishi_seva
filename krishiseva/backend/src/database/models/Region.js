const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ["North Gujarat", "South Gujarat", "Central Gujarat", "Saurashtra", "Kachchh"],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Region", regionSchema);
