const mongoose = require("mongoose");

const aiConversationSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: "New Conversation"
    },
    language: {
      type: String,
      default: "en"
    },
    context: {
      type: String,
      default: ""
    },
    lastMessageAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound index to quick-query conversation history logs sequentially
aiConversationSchema.index({ farmerId: 1, lastMessageAt: -1 });

module.exports = mongoose.model("AIConversation", aiConversationSchema);
