const dotenv = require("dotenv");
dotenv.config();
const Otp = require("../models/Otp");
const User = require("../models/User");
const Profile = require("../models/Profile");
const OtpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

// Send OTP
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const checkEmail = await User.findOne({ email });

        if (checkEmail) {
            return res.status(401).json({
                success: false,
                message: "User already registered",
            });
        }

        let otp;
        let existingOtp;
        do {
            otp = OtpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            existingOtp = await Otp.findOne({ otp });
        } while (existingOtp);

        const otpBody = await Otp.create({ email, otp });
        console.log("OTP Generated:", otpBody);

        return res.status(202).json({
            success: true,
            message: "OTP sent successfully",
            otp, // Consider removing in production
        });
    } catch (error) {
        console.error("Error in sending OTP:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Sign Up
const signUp = async (req, res) => {
    try {
        const { email, password, confirmPassword, firstName, lastName, accountType, contactNumber, otp } = req.body;

        if (!email || !password || !confirmPassword || !firstName || !lastName || !accountType || !contactNumber || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirmPassword do not match",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Validate OTP
        const latestOtp = await Otp.findOne({ email }).sort({ createdAt: -1 }).limit(1);
        if (!latestOtp || latestOtp.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        });

        const newUser = await User.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            accountType,
            contactNumber,
            additonalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(firstName + " " + lastName)}`
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: newUser,
        });
    } catch (error) {
        console.error("Error in sign up:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "User cannot be registered, please try again",
        });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found, please sign up",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }

        const token = jsonwebtoken.sign(
            { id: user._id, email: user.email, role: user.accountType },
            process.env.JWT_SECRET,
            { expiresIn: "2d" }
        );

        user.password = undefined;
        user.token = token;

        const options = {
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        res.cookie("token", token, options).status(200).json({
            success: true,
            message: "User logged in successfully",
            user
        });

    } catch (e) {
        console.error("Error in login:", e);
        return res.status(500).json({
            success: false,
            message: e.message || "User cannot be logged in, please try again",
        });
    }
};

// Change Password
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirm password do not match",
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid old password",
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });

    } catch (e) {
        console.error("Error in changing password:", e);
    }
};

module.exports={
    sendOTP,
    signUp,
    login,
    changePassword
};
