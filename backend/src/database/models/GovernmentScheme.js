const mongoose = require("mongoose");

const governmentSchemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    department: {
      type: String,
      required: true
    },
    state: {
      type: String,
      default: "All India",
      index: true
    },
    benefits: {
      type: String,
      required: true
    },
    eligibility: {
      farmerType: { type: String, default: "All Farmers" },
      maxLandSize: { type: String, default: "No limit" }, // e.g. "5.0" hectares
      state: { type: String, default: "All India" },
      crops: { type: String, default: "All Crops" }
    },
    requiredDocuments: {
      type: [String],
      default: ["Aadhar Card", "Land Record (7/12, 8-A)"]
    },
    applicationUrl: {
      type: String,
      default: null // null if not verified
    },
    deadline: {
      type: String,
      required: true
    },
    benefitType: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: "General"
    },
    crops: {
      type: mongoose.Schema.Types.Mixed, // string or array
      default: "All Crops"
    },
    farmerTypes: {
      type: mongoose.Schema.Types.Mixed,
      default: "All Farmers"
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes
governmentSchemeSchema.index({ state: 1, isActive: 1 });

module.exports = mongoose.model("GovernmentScheme", governmentSchemeSchema);
