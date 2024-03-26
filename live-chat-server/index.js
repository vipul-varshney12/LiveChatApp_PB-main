const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose"); // Removed default import
const app = express();
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// CORS Setup
app.use(
  cors({
    origin: "*",
  })
);

// Load Environment Variables
dotenv.config();

// Body parsing Middleware
app.use(express.json());

// Importing routes
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");

// Database Connection
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Server is Connected to the Database");
  } catch (err) {
    console.log("Server is NOT connected to the Database", err.message);
  }
};

connectDb();

// API running message
app.get("/", (req, res) => {
  res.send("API is running");
});

// Using routes
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

// Server setup
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Socket.io setup
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
  pingTimeout: 60000,
});

// Socket.io connection handling
io.on("connection", (socket) => {
  socket.on("setup", (user) => {
    socket.join(user.data._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
  });
  socket.on("new message", (newMessageStatus) => {
 var chat = newMessageStatus.chat;
    if (!chat.users) {
      return console.log("chat.users not defined");
    }

    chat.users.forEach((user) => {
      if (user._id == newMessageStatus.sender._id) return;
      socket.in(user._id).emit(",essage  recieved",newMessageRecieved);
    });
  });
});

