// Load environment variables from .env file
require('dotenv').config();
console.log("Razorpay Key:", process.env.RAZORPAY_KEY_ID);
console.log("Razorpay Secret:", process.env.RAZORPAY_SECRET);

// Debugging: Check if the environment variables are loaded
const Razorpay = require("razorpay");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

module.exports = { instance };
