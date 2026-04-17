const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    //check for null values
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    //check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //unique upi id generation
    const sanitizedname = email.toLowerCase();
    const upiId = `${sanitizedname.split("@")[0]}@phonepay`;

    //create user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      upiId,
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        upiId: user.upiId,
        balance: user.balance,
        hasMpinSet: false,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        upiId: user.upiId, // New Feature
        balance: user.balance,
        hasMpinSet: !!user.mpin, // Returns true if mpin is set
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -mpin");
    if (user) {
      const responseUser = user.toObject();
      responseUser.hasMpinSet = !!req.user.mpin;
      res.json(responseUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Set MPIN
const setupMpin = async (req, res) => {
  try {
    const { mpin } = req.body; // Expecting a 4 or 6 digit string

    if (!mpin || mpin.length < 4) {
      return res
        .status(400)
        .json({ message: "Please provide a valid MPIN (at least 4 digits)" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedMpin = await bcrypt.hash(mpin.toString(), salt);

    const user = await User.findById(req.user._id);
    user.mpin = hashedMpin;
    await user.save();

    res.json({ message: "MPIN setup successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logoutUser = async (req, res) => {
  // clear the cookies for logout
  res.clearCookie("token");

  res.status(200).json({ message: "Logout successful" });
};

module.exports = {
  registerUser,
  loginUser,
  setupMpin,
  getUserProfile,
  logoutUser,
};
