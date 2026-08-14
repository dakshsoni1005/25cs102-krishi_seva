const mongoose = require("mongoose");

const cropTaskSchema = new mongoose.Schema(
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
    cropCycleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CropCycle",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    taskType: {
      type: String,
      enum: ["irrigation", "fertilizer", "pesticide", "inspection", "weeding", "harvesting", "other"],
      required: true,
      default: "other"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium"
    },
    dueDate: {
      type: Date,
      required: true
    },
    completedAt: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ["pending", "completed", "skipped"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

// Indexes
cropTaskSchema.index({ farmerId: 1, dueDate: 1 });
cropTaskSchema.index({ cropCycleId: 1, status: 1 });

module.exports = mongoose.model("CropTask", cropTaskSchema);
