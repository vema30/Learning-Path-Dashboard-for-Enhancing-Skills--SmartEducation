require("dotenv").config();
const Otp = require("../models/Otp");
const User = require("../models/User");
const Profile = require("../models/Profile");
const OtpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mailSender = require("../utils/mailSender");

// Send OTP
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        
        
        const checkEmail = await User.findOne({ email });
        if (checkEmail) {
            return res.status(401).json({ success: false, message: "User already registered" });
        }

        let otp;
        let existingOtp;
        do {
           
            otp = OtpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
            existingOtp = await Otp.findOne({ otp });
            console.log(otp);
        } while (existingOtp);
         console.log(otp,"otp");
       try{
        await Otp.create({ email, otp, createdAt: Date.now() });
       }
       catch(e)
       {
        console.log("error in otp model")
       }

        console.log("hellobro ",process.env.MAIL_USER);

        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 465,
            secure: true,
            auth: { user: process.env.MAIL_USER.trim(), pass: process.env.MAIL_PASSWORD.trim() }
        });

        let mailOptions 
   
        mailOptions= {
            from: `"Your App Name" <${process.env.MAIL_USER}>`,
            to: email.trim(), // Trim any accidental spaces
            subject: "Your OTP Code",
            text: `Your OTP code is: ${otp}`,
        };
       
        //  return res.status(500).send(
        //     {
        //         otp:otp
        //     }
        //  )
     
        console.log("Mail Options:", mailOptions);
        
       // let mailOptions = { from: process.env.MAIL_USER, to: email, subject: 'Your OTP Code', text: `Your OTP code is: ${otp}` };
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Failed to send OTP email", error: err.message,otp:otp });
            } else {
                return res.status(202).json({ success: true, message: "OTP sent successfully" });
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Error in sending OTP" });
    }
};

// Sign Up
const signUp = async (req, res) => {
    try {
        const { email, password, confirmPassword, firstName, lastName, accountType, otp } = req.body;

        // Check all required fields
        if (!email || !password || !confirmPassword || !firstName || !lastName || !accountType || !otp) {
            return res.status(403).json({ success: false, message: "All fields are required" });
        }

        // Check password match
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Profile with Error Handling
        const profileDetails = await Profile.create({
            gender: "X",
            dateOfBirth: Date.now(),
            about: "ADD ABOUT ",
            contactNumber: "0000000000"
        });

        if (!profileDetails) {
            return res.status(500).json({ success: false, message: "Failed to create profile" });
        }

        // Create User with profile reference
        const newUser = await User.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(firstName + " " + lastName)}`
        });

        if (!newUser) {
            return res.status(500).json({ success: false, message: "Failed to create user" });
        }

        return res.status(201).json({ success: true, message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("Error in signUp:", error);
        return res.status(500).json({ success: false, message: "User cannot be registered, please try again" });
    }
};



// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found, please sign up" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        const token = jsonwebtoken.sign(
            { id: user._id, email: user.email, role: user.accountType },
            process.env.JWT_SECRET,
            { expiresIn: "2d" }
        );

        user.password = undefined;

        // Setting the token in the cookie
        res.cookie("token", token, {
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        });

        // Responding with success and token
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user,
            token,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "User cannot be logged in, please try again",
        });
    }
};


const changePassword = async (req, res) => {
    console.log("hey you are in backend")
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        // Validate the input fields
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: "New password and confirm password do not match" });
        }

        // Find the user from the database
        const user = await User.findById(req.user.id);  // req.user.id should be set by your authentication middleware
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Verify the old password
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid old password" });
        }

        // Hash the new password and save it
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Error changing password" });
    }
};


module.exports = { sendOTP, signUp, login, changePassword };