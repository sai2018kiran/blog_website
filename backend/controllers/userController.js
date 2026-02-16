import User from "../models/User.js";
import Blog from "../models/Blog.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";


export const signupUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const { password: _, ...userData } = user._doc;
    res.status(201).json({ message: "Signup successful", user: userData });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secretkey", {
      expiresIn: "7d",
    });

    const { password: _, ...userData } = user._doc;
    res.status(200).json({ message: "Login successful", token, user: userData });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// 1. Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

// 2. Get count of blogs created by user
export const getUserBlogCount = async (req, res) => {
  try {
    const count = await Blog.countDocuments({ user: req.params.id });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Failed to count blogs", error: error.message });
  }
};

// 3. Update user profile
export const updateUser = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
    res.json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// 4. Delete user and their blogs
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Delete all blogs created by the user
    await Blog.deleteMany({ user: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: "User and their blogs deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed", error: error.message });
  }
};


// 5. Change password
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Password change failed", error: error.message });
  }
};

// 6. Update profile image
export const updateProfileImage = async (req, res) => {
  const userId = req.params.id;
  const { imageUrl } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, { profileImage: imageUrl }, { new: true }).select("-password");
    res.json({ message: "Profile image updated", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile image", error: error.message });
  }
};
