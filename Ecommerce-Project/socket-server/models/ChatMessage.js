const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      index: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.ChatMessage ||
  mongoose.model("ChatMessage", chatMessageSchema);
