const Transcation = require("../models/Transaction.model.js");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const sendMoney = async (req, res) => {
  try {
    const { phone, amount, mpin } = req.body;
    const senderId = req.user._id;
    if (!mpin) {
      return res.status(400).json({ message: "Please provide MPIN" });
    }
    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }
    const isMpinMatch = await bcrypt.compare(mpin, sender.mpin);
    if (!isMpinMatch) {
      return res.status(401).json({ message: "Invalid MPIN" });
    }
    const receiver = await User.findOne({ phone });
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }
    if (sender.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    //transfer logic
    sender.balance -= amount;
    receiver.balance += amount;
    await sender.save();
    await receiver.save();

    const transcation = await Transcation.create({
      sender: sender._id,
      receiver: receiver._id,
      amount,
      types: "Transfer",
      status: "Success",
    });
    res.status(200).json({ message: "Money sent successfully", transcation });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await Transcation.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "name email phone")
      .populate("receiver", "nname email phoneame")
      .sort({ timestamp: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

module.exports = { sendMoney, getTransactionHistory };
