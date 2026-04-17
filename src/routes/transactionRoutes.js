const express = require("express");
const router = express.Router();
const { protect } = require("../middlewear/protect");
const {
  sendMoney,
  getTransactionHistory,
} = require("../contollers/transaction.controller");

router.post("/send", protect, sendMoney);
router.post("/history", protect, getTransactionHistory);

module.exports = router;
