import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptFriendRequest,
  fetchFriendRequest,
} from "../../store/friendRequestSlice";

const FriendRequest = () => {
  const dispatch = useDispatch();
  const { friendRequests, status } = useSelector(
    (state) => state.friendRequest
  );

  useEffect(() => {
    dispatch(fetchFriendRequest());
  }, [dispatch]);

  if (status === "loading") {
    return <p>Loading friend requests...</p>;
  }

  if (!friendRequests || friendRequests.length === 0) {
    return <p>No friend requests</p>;
  }

  // ✅ Accept request with correct ID
  const handleAcceptRequest = (id) => {
    dispatch(acceptFriendRequest(id));
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-3">Friend Requests</h2>
      {friendRequests.map((req) => (
        <div
          key={req._id}
          className="flex items-center justify-between border rounded p-2 mb-2"
        >
          {/* User Info */}
          <div className="flex items-center gap-2">
            <img
              src={req.from?.image}
              alt={req.from?.username}
              className="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-sm">{req.from?.username}</p>
              <p className="text-xs text-gray-500">{req.from?.email}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => handleAcceptRequest(req._id)}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
            >
              Confirm
            </button>
            <button className="px-2 py-1 text-xs bg-gray-300 rounded">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequest;
