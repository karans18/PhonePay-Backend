const express = require("express");
const router = express.Router();
// const authController = require('../contollers/auth.controller');
const {
  registerUser,
  loginUser,
  setupMpin,
  getUserProfile,
  logoutUser,
} = require("../contollers/auth.controller");
const { protect } = require("../middlewear/protect");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/set-mpin", protect, setupMpin);
router.get("/profile", protect, getUserProfile);
router.post("/logout", logoutUser);

module.exports = router;
