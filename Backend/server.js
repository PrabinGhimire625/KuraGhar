import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import { Server } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoute.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", userRouter);

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
  console.log("User connected:", socket.user.username);

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User ${socket.user.username} joined ${room}`);
  });

  socket.on("message", ({ room, message }) => {
    if (room) {
      io.to(room).emit("receive-message", {
        user: socket.user.username,
        message,
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
