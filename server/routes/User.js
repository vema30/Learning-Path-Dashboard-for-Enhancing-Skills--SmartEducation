// Import the required modules
const express = require("express");
const router = express.Router();

// Import the required controllers and middleware functions
const {
  login,
  signUp,
  sendOTP,
  changePassword,
} = require("../controllers/Auth");

const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword");

const { auth } = require("../middlewares/auth");

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", login);

// Route for user signup
router.post("/signup", signUp);

// Route for sending OTP to the user's email
router.post("/send-otp", sendOTP); // Changed from "/sendotp" to "/send-otp"
// Route for Changing the password
router.put("/change-password", auth, changePassword); // Changed from "/changepassword" to "/change-password"

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken);

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword);

// Export the router for use in the main application
module.exports = router;
