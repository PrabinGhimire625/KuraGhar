import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleUser } from "../../store/authSlice";
import { sendFriendRequest, acceptFriendRequest } from "../../store/friendRequestSlice";
import { FiUserPlus } from "react-icons/fi";

const SingleUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { singleUser, status } = useSelector((state) => state.auth);
  const { status: friendStatus } = useSelector((state) => state.friendRequest);

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleUser(id));
    }
  }, [id, dispatch]);


  const handleSendRequest = () => {
    dispatch(sendFriendRequest(id));
  };

  // const handleAcceptRequest = () => {
  //   dispatch(acceptFriendRequest(id));
  // };

  return (
    <div className="flex justify-center px-4 mt-10">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg text-center">
        {/* Avatar */}
        <img
          src={singleUser?.image || "https://via.placeholder.com/120"}
          alt={singleUser?.username}
          className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-blue-100 shadow-md"
        />

        <h2 className="text-2xl font-bold text-gray-800 mt-4">{singleUser?.username}</h2>
        <p className="text-gray-600 mt-1">{singleUser?.email}</p>
        <span className="inline-block mt-2 px-4 py-1 text-sm rounded-full bg-blue-100 text-blue-600 font-medium">
          {singleUser?.role || "User"}
        </span>

        <p className="text-gray-700 mt-4 italic">
          {singleUser?.bio || "This user hasn’t added a bio yet."}
        </p>

        {/* Action buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleSendRequest}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition disabled:opacity-50"
          >
            <FiUserPlus /> Add Friend
          </button>

          <button
            className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
          >
            <FiUserPlus /> Message
          </button>
        </div>

        {/* Extra info */}
        <div className="mt-6 border-t pt-4 text-sm text-gray-600 space-y-2">
          <p>
            <span className="font-semibold">Joined:</span>{" "}
            {singleUser?.createdAt ? new Date(singleUser.createdAt).toLocaleDateString() : "Unknown"}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {singleUser?.isActive ? "Active " : "Inactive ❌"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SingleUser;
