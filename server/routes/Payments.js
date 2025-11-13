const express = require("express");
const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/Payments");
const { auth } = require("../middlewares/auth"); // if you have authentication middleware
const router = express.Router();

// Capture Payment - create Razorpay order
router.post("/order", capturePayment);

// Verify Payment after success
router.post("/verify", verifyPayment);

// (Optional) Send success email after verified payment
router.post("/send-email", sendPaymentSuccessEmail);

module.exports = router;
