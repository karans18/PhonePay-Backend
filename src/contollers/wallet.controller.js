const bcrypt = require("bcryptjs");
const Transcation = require("../models/Transaction.model");
const User = require("../models/user.model");

const addMoney = async (req, res) => {
  try {
    const { amount, mpin } = req.body;
    const userId = req.user._id;
    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.balance += amount;
    await user.save();
    const transaction = await Transcation.create({
      amount,
      sender: userId,
      receiver: userId,
      amount,
      types: "Add_Money",
      status: "Success",
    });
    res.json({ message: "Money added successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const payBill = async (req, res) => {
  try {
    const { billerName, amount, mpin } = req.body;
    const userId = req.user._id;
    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }
    if (!mpin) {
      return res.status(400).json({ message: "Please provide MPIN" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMpinMatch = await bcrypt.compare(mpin, user.mpin);
    if (!isMpinMatch) {
      return res.status(401).json({ message: "Invalid MPIN" });
    }
    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    user.balance -= amount;
    await user.save();
    const transaction = await Transcation.create({
      amount,
      sender: userId,
      receiver: userId,
      amount,
      types: "Bill_Payment",
      status: "Success",
    });
    res.json({ message: "Bill paid successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addMoney, payBill };
