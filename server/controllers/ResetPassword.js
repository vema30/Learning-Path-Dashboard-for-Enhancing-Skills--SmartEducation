const User = require("../models/User");

const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
console.log("hey its user model ",User);
// Generate Password Reset Token
const resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;
       
        // Check if the user exists
        const user = await User.findOne({ email: email });
        if (!user) {    
            return res.status(400).json({
                success: false,
                message: "User does not exist",
            });
        }

        // Generate a reset token
        const token = crypto.randomUUID();
        const updatedDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000, // Expires in 5 minutes
            },
            { new: true }
        );

        const url = `http://localhost:3000/update-password/${token}`;

        // Send reset email
        await mailSender(email, "Reset Password", `<a href="${url}">Click here to reset your password</a>`);

        return res.status(200).json({
            success: true,
            message: "Reset password link sent to your email",
        });

    } catch (error) {
        console.error("Error in generating reset password token:", error);
        return res.status(500).json({
            success: false,
            message: "Error in generating reset password token",
        });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        // Check if token is valid
        const userDetails = await User.findOne({ token: token });
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "Invalid token",
            });
        }

        // Check if token has expired
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Token has expired, please request a new one",
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password and remove token
        await User.findOneAndUpdate(
            { token: token },
            {
                password: hashedPassword,
              
                //resetPasswordExpires: null,
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });

    } catch (error) {
        console.error("Error in resetting password:", error);
        return res.status(500).json({
            success: false,
            message: "Error in resetting password",
        });
    }
};

module.exports = { resetPasswordToken, resetPassword };
