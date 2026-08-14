const mongoose = require("mongoose");

const schemeEligibilitySchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    schemeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GovernmentScheme",
      required: true
    },
    eligible: {
      type: Boolean,
      required: true
    },
    score: {
      type: Number,
      default: 100
    },
    matchedCriteria: {
      type: [String],
      default: []
    },
    unmatchedCriteria: {
      type: [String],
      default: []
    },
    missingDocuments: {
      type: [String],
      default: []
    },
    reason: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["Approved", "Pending", "Eligible", "Applied", "Not Eligible"],
      default: "Eligible"
    },
    nextSteps: {
      type: String,
      default: ""
    },
    checkedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index to prevent duplicate eligibility records for the same farmer/scheme
schemeEligibilitySchema.index({ farmerId: 1, schemeId: 1 }, { unique: true });

module.exports = mongoose.model("SchemeEligibility", schemeEligibilitySchema);
