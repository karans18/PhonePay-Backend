const mongoose = require("mongoose");

const transcationSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  billerName: {
    type: String,
  },
  types: {
    type: String,
    enum: ["Transfer", "Add_Money", "Bill_Payment", "WITHDRAWL "],
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Success", "Failed"],
    default: "Pending",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Transcation", transcationSchema);
