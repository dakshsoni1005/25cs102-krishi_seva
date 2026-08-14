const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    regionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index to guarantee uniqueness of districts per region
districtSchema.index({ name: 1, regionId: 1 }, { unique: true });

module.exports = mongoose.model("District", districtSchema);
