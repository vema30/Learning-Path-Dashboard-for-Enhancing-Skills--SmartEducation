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
        const { email, password, confirmPassword, firstName, lastName, accountType, contactNumber, otp } = req.body;

        // ✅ Check if all required fields are provided
        if (!email || !password || !confirmPassword || !firstName || !lastName || !accountType || !contactNumber ) {
            return res.status(403).json({ success: false, message: "All fields are required" });
        }

        // ✅ Password Match Check
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        // ✅ Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // ✅ Get Latest OTP
     //   const latestOtp = await Otp.findOne({ email }).sort({ createdAt: -1 });

        // if (!latestOtp || latestOtp.otp !== otp) {
        //     return res.status(400).json({ success: false, message: "Invalid OTP" });
        // }

        // // ✅ Check OTP Expiry
        // if (Date.now() - latestOtp.createdAt.getTime() > 5 * 60 * 1000) {
        //     return res.status(400).json({ success: false, message: "OTP expired, please request a new one" });
        // }

        // ✅ Hash Password & Create Profile in Parallel
        const [hashedPassword, profileDetails] = await Promise.all([
            bcrypt.hash(password, 10),
            Profile.create({
                gender: "",
                dateOfBirth: "",
                about: "",
                contactNumber: contactNumber, // ✅ Keep contactNumber, since it's provided
            })
        ]);

        // ✅ Create User
        const newUser = await User.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            accountType,
            contactNumber,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(firstName + " " + lastName)}`
        });

        // ✅ Return Success Response
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

        const token = jsonwebtoken.sign({ id: user._id, email: user.email, role: user.accountType }, process.env.JWT_SECRET, { expiresIn: "2d" });
        user.password = undefined;
        res.cookie("token", token, { expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), httpOnly: true }).status(200).json({ success: true, message: "User logged in successfully", user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "User cannot be logged in, please try again" });
    }
};

// Change Password
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: "New password and confirm password do not match" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid old password" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        console.log("password saved successfully")
        return res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Error changing password" });
    }
};

module.exports = { sendOTP, signUp, login, changePassword };