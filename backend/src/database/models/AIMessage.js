const mongoose = require("mongoose");

const aiMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AIConversation",
      required: true,
      index: true
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

// Compound index to quick-list messages sequentially within a thread
aiMessageSchema.index({ conversationId: 1, createdAt: 1 });

module.exports = mongoose.model("AIMessage", aiMessageSchema);
