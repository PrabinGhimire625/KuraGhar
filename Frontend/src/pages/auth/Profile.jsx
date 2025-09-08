import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateUserProfile, userProfile } from "../../store/authSlice";
import { STATUS } from "../../globals/Status";

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, status } = useSelector((state) => state.auth);

  const [userData, setUserData] = useState({
    username: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  // Load profile on mount
  useEffect(() => {
    dispatch(userProfile());
  }, [dispatch]);

  // Update local state when profile is loaded
  useEffect(() => {
    if (profile) {
      setUserData({
        username: profile.username || "",
        image: null,
      });
      setPreview(profile.image || null);
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files[0]) {
      setUserData((prev) => ({ ...prev, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", userData.username);
    if (userData.image) formData.append("image", userData.image);

    try {
      await dispatch(updateUserProfile({ userData: formData }));
      toast.success("Profile updated successfully!");
      dispatch(userProfile()); // refresh profile
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="flex items-start justify-center flex-1">
      <form
        onSubmit={handleSubmit}
        className="flex items-start px-12 py-12 rounded-lg shadow-[0_0_10px_2px_rgba(255,255,255,0.1)] mt-2 mx-5 relative"
      >
        {/* Profile Image Upload */}
        <div className="relative">
          <label className="cursor-pointer">
            <img
              className="object-cover rounded-full shadow-lg bg-indigo-50 text-indigo-600 h-40 w-40 md:h-56 md:w-56"
              src={preview || "/default-avatar.png"}
              alt="Profile"
            />
            <input
              name="image"
              onChange={handleChange}
              type="file"
              accept="image/*"
              className="hidden"
            />
          </label>
          <p className="absolute top-2 right-2 text-sm md:text-lg text-gray-400 bg-gray-800 px-2 py-1 rounded cursor-pointer hover:text-white hover:bg-gray-700 transition">
            Upload
          </p>
        </div>

        {/* User Info */}
        <div className="text-left ml-4 mt-8">
          <input
            name="username"
            onChange={handleChange}
            type="text"
            value={userData.username}
            className="text-3xl md:text-6xl text-gray-700 font-bold bg-transparent border-b-2 border-gray-400 focus:outline-none focus:border-indigo-400 ml-5 py-1 leading-tight"
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="absolute bottom-16 right-4 bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default Profile;
