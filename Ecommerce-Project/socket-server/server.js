const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const ChatMessage = require("./models/ChatMessage");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommercedb");
  console.log("MongoDB connected for socket chat");
};

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("newOrder", (data) => {
    console.log("New Order:", data);

    // Broadcast to admin panel (client listens for adminNotification)
    io.emit("adminNotification", data);
  });

  socket.on("joinRoom", ({ roomId }) => {
    if (!roomId) return;
    socket.join(roomId);
  });

  socket.on("joinAdminRoom", () => {
    socket.join("admins");
  });

  socket.on("loadMessages", async ({ roomId }) => {
    if (!roomId) return;
    try {
      const messages = await ChatMessage.find({ roomId })
        .sort({ createdAt: 1 })
        .lean();
      socket.emit("messageHistory", { roomId, messages });
    } catch (error) {
      socket.emit("chatError", { message: error.message });
    }
  });

  socket.on("sendMessage", async (payload) => {
    const { roomId, senderId, senderRole, receiverId, message } = payload || {};
    if (!roomId || !senderId || !senderRole || !receiverId || !message?.trim()) {
      socket.emit("chatError", { message: "Invalid message payload" });
      return;
    }

    try {
      const savedMessage = await ChatMessage.create({
        roomId,
        senderId,
        senderRole,
        receiverId,
        message: message.trim(),
      });
      io.to(roomId).emit("newMessage", savedMessage);
      if (senderRole === "user") {
        io.to("admins").emit("adminUnreadMessage", savedMessage);
      }
    } catch (error) {
      socket.emit("chatError", { message: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

connectDB()
  .then(() => {
    server.listen(5000, () => {
      console.log("Socket server running on 5000");
    });
  })
  .catch((error) => {
    console.error("Failed to start socket server:", error.message);
    process.exit(1);
  });
