import FriendRequest from "../model/friendRequestModel.js";
import User from "../model/userModel.js";

// Send friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const fromId = req.user.id;
    const toId = req.params.toId;

    if (!toId) return res.status(400).json({ message: "Recipient ID required" });
    if (fromId === toId) return res.status(400).json({ message: "Cannot add yourself" });

    const existing = await FriendRequest.findOne({ from: fromId, to: toId, status: "pending" });
    if (existing) return res.status(400).json({ message: "Request already sent" });

    const request = await FriendRequest.create({ from: fromId, to: toId });

    // Emit to recipient in realtime
    const io = req.app.get("io");
    io?.to(toId).emit("friend-request", {
      _id: request._id,
      from: { _id: fromId, username: req.user.username },
    });

    res.status(200).json({ message: "Friend request sent", request });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Accept friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const requestId = req.params.requestId;

    const request = await FriendRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.to.toString() !== userId) return res.status(403).json({ message: "Not authorized" });

    request.status = "accepted";
    await request.save();

    // Add each other as friends
    await User.findByIdAndUpdate(userId, { $addToSet: { friends: request.from } });
    await User.findByIdAndUpdate(request.from, { $addToSet: { friends: userId } });

    // Emit to both users
    const io = req.app.get("io");
    io?.to(userId).emit("friend-request-accepted", request);
    io?.to(request.from.toString()).emit("friend-request-accepted", request);

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Cancel friend request (sender cancels pending request)
export const cancelFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const requestId = req.params.requestId;

    const request = await FriendRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.from.toString() !== userId)
      return res.status(403).json({ message: "Not authorized" });
    if (request.status !== "pending")
      return res.status(400).json({ message: "Cannot cancel a processed request" });

    // Proper deletion
    await FriendRequest.findByIdAndDelete(requestId);

    // Emit to recipient that request was cancelled
    const io = req.app.get("io");
    io?.to(request.to.toString()).emit("friend-request-cancelled", {
      _id: requestId,
      from: request.from,
      to: request.to,
    });

    res.json({ message: "Friend request cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Reject friend request (recipient rejects pending request)
export const rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const requestId = req.params.requestId;

    const request = await FriendRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.to.toString() !== userId) return res.status(403).json({ message: "Not authorized" });
    if (request.status !== "pending") return res.status(400).json({ message: "Cannot reject a processed request" });

    request.status = "rejected";
    await request.save();

    // Emit to sender that request was rejected
    const io = req.app.get("io");
    io?.to(request.from.toString()).emit("friend-request-rejected", request);

    res.json({ message: "Friend request rejected" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Get all friend requests
export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await FriendRequest.find({
      to: userId,       // only requests where the current user is the receiver
      status: "pending" // only pending requests
    })
      .populate("from", "_id username email image")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Friend request fetch successfully", data: requests });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
