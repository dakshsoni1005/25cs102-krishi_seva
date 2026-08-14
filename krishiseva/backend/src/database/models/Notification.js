const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ["weather", "crop", "pest", "market", "government", "recommendation", "system"],
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    referenceType: {
      type: String,
      default: "" // e.g. "CropCycle", "WeatherAlert"
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: {
      type: Date,
      default: null
    },
    expiresAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Indexes
notificationSchema.index({ farmerId: 1, isRead: 1 });
notificationSchema.index({ farmerId: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
