import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchUserDetails } from "../../store/authSlice";

const UserSearch = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  const { searchUser, status } = useSelector((state) => state.auth);

  useEffect(() => {
    if (query?.trim()) {
      dispatch(searchUserDetails(query));
    }
  }, [query, dispatch]);

  return (
    <div className="flex justify-center items-center">
      <div className="p-4 w-full max-w-md">
        {/* Search Results */}
        {status === "loading" && <p className="text-gray-500">Loading...</p>}
        {status === "error" && (
          <p className="text-red-500">Something went wrong</p>
        )}

        {searchUser && searchUser.length > 0 ? (
          <ul className="space-y-3">
            {searchUser.map((user) => (
              <li key={user._id}>
                <Link
                  to={`/singleUser/${user._id}`}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  {/* Avatar */}
                  <img
                    src={user.image || "https://via.placeholder.com/40"}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {/* Username */}
                  <span className="text-gray-800 font-medium">
                    {user.username}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          status === "success" && (
            <p className="text-gray-500">No users found for "{query}"</p>
          )
        )}
      </div>
    </div>
  );
};

export default UserSearch;
