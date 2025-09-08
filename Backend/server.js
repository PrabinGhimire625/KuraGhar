import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import { Server } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoute.js";
import connectCloudinary from "./config/cloudinary.js";
import friendRequestRouter from "./routes/friendRequestRoute.js";

dotenv.config();
connectDB();
connectCloudinary();

const app = express();
const PORT = process.env.PORT || 3000;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});

// Make io available in controllers
app.set("io", io);

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api", userRouter);
app.use("/api/friendRequest", friendRequestRouter);

app.get("/", (req, res) => {
  res.send("Messenger API is running...");
});

// SOCKET.IO AUTH
io.use((socket, next) => {
  cookieParser()(socket.request, {}, (err) => {
    if (err) return next(err);
    const token = socket.request.cookies?.token;
    if (!token) return next(new Error("Authentication Error"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      return next(new Error("Authentication Error"));
    }
  });
});

// SOCKET.IO EVENTS
io.on("connection", (socket) => {
  const userId = socket.user.id;
  socket.join(userId); // personal room
  console.log("User connected:", socket.user.username);

  // Join chat room
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User ${socket.user.username} joined room ${room}`);
  });

  // Chat message
  socket.on("message", ({ room, message }) => {
    if (room) {
      io.to(room).emit("receive-message", {
        user: socket.user.username,
        message,
      });
    }
  });

  // Optional: friend request via socket (or use HTTP route)
  socket.on("send-friend-request", async ({ toId }) => {
    try {
      // You can call your controller function directly or via HTTP request
      // Here is a simple example using HTTP route with axios
      const axios = await import("axios");
      const res = await axios.default.post(
        `http://localhost:${PORT}/api/users/${toId}/friend-request`,
        {},
        {
          headers: { Cookie: socket.request.headers.cookie },
          withCredentials: true,
        }
      );
      socket.emit("friend-request-sent", res.data);
    } catch (err) {
      socket.emit("error", {
        message: err.response?.data?.message || "Error sending request",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.user.username);
  });
});

// START SERVER
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});