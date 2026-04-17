const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    upiId: {
      type: String,
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    mpin: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);
const User = mongoose.model("User", userSchema);
module.exports = User;  
