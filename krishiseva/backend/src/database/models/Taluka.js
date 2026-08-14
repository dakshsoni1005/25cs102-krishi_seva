const mongoose = require("mongoose");

const talukaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    districtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index to guarantee uniqueness of talukas per district
talukaSchema.index({ name: 1, districtId: 1 }, { unique: true });

module.exports = mongoose.model("Taluka", talukaSchema);
