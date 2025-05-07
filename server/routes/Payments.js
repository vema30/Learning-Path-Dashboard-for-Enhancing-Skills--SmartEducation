const express = require("express");
const router = express.Router();

const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/Payments");
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");

// Capture Payment Route
router.post("/order", auth, isStudent, capturePayment);

// Verify Payment Route
router.post("/verify", auth, isStudent, verifyPayment);

// Send Payment Success Email Route
router.post("/send-email", auth, isStudent, sendPaymentSuccessEmail);

module.exports = router;
