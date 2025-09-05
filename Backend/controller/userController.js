import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

// Register
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashPassword });
  await newUser.save();

  res.status(200).json({ message: "User registered successfully", data: newUser });
};

// login
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    const payload = { id: user._id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRETE, { expiresIn: "1h" });

    // save in cookie
    res.status(200).json({ message: "Login successful", data: user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

//user Profile
export const profile = async (req, res) => {
  const id = req.user.id;
  try {
    const profileData = await User.findById(id);
    if (profileData) {
      res.status(200).json({
        message: "Successfully fetched the user profile",
        data: profileData,
      });
    } else {
      c
      res.status(404).json({ message: "Error fetching user profile", data: [] });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", errorMessage: err.message });
  }
};


// update user profile
export const updateUser = async (req, res) => {
  const { username } = req.body;
  const userId = req.params.id;
  const imageFile = req.files?.image?.[0];
  const updateData = {};

  if (username) updateData.username = username;

  if (imageFile) {
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    updateData.image = imageUpload.secure_url;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true }
  );

  if (!updatedUser) return res.status(404).json({ message: "User not found" });

  res.status(200).json({ message: "User updated successfully", data: updatedUser });
};


//fetch all user
export const fetchAllUser = async (req, res) => {
  const allUser = await User.find();
  if (allUser.length > 0) {
    res.status(200).json({ message: "Successfully fetch all the users", data: allUser });
  } else {
    res.status(404).json({ message: "User not found" });
  }
}


//fetch single user
export const fetchSingleUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Successfully fetched user",
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
