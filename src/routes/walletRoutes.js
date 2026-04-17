const express = require("express");
const router = express.Router();
const { protect } = require("../middlewear/protect");
const { payBill, addMoney } = require("../contollers/wallet.controller");

router.post("/pay-bill", protect, payBill);
router.post("/add-money", protect, addMoney);

module.exports = router;
