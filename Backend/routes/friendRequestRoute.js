import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
  cancelFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
} from "../controller/friendRequestController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Send request
router.post("/send/:toId", isAuthenticated, sendFriendRequest);
router.get("/", isAuthenticated, getFriendRequests);

// Accept request
router.post("/accept/:requestId", isAuthenticated, acceptFriendRequest);

// Cancel request
router.post("/cancel/:requestId", isAuthenticated, cancelFriendRequest);

// Reject request
router.post("/reject/:requestId", isAuthenticated, rejectFriendRequest);

export default router;
