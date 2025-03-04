// Load environment variables from .env file
require('dotenv').config();

// Debugging: Check if the environment variables are loaded
console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY_ID);
console.log('Razorpay Key Secret:', process.env.RAZORPAY_KEY_SECRET);

// Import Razorpay package
const Razorpay = require('razorpay');

// Initialize Razorpay instance with the provided API credentials
exports.razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});
