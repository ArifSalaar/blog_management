const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose")


const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({ message: 'User created successfully', userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
};



const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(200).json({data:{
      success: true,
      message: 'Login successful', token 
    } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};



const uploadProfileImage = async (req, res) => {
  try {
    let userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    userId = userId.trim();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.files || !req.files.profile_image || req.files.profile_image.length === 0) {
      return res.status(400).json({ message: "No profile image uploaded" });
    }

   
    const profileImagePath = req.files.profile_image[0].path;
    const fullImageUrl = `${process.env.BASE_URL}/${profileImagePath.replace(/\\/g, '/')}`;

    console.log("Full image URL:", fullImageUrl);

    // Save image URL to user profile
    user.profileImage = fullImageUrl;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      profile_image: fullImageUrl,
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload profile image",
      error: error.message,
    });
  }
};


module.exports = {signup,login,uploadProfileImage}
