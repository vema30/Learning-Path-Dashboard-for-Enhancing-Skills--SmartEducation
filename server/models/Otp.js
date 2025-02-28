const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Schema = mongoose.Schema;

const OtpSchema = new Schema({
  
  
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000) // OTP expires in 10 minutes
  },
  isVerified: {
    type: Boolean,
    default: false // Initially false, set to true after successful verification
  }
});

// TTL index for automatic deletion of expired OTPs
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/**
 * Pre-save middleware: Hash OTP before saving & send email
 */
OtpSchema.pre("save", async function (next) {
  const otpDocument = this;

  // Generate and hash the OTP
  const plainOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const salt = await bcrypt.genSalt(10);
  otpDocument.otp = await bcrypt.hash(plainOtp, salt);

  try {
    // Send OTP email
    await sendOtpEmail(otpDocument.email, plainOtp);
    console.log(`OTP sent to ${otpDocument.email}`);
  } catch (error) {
    console.error("Error sending OTP:", error);
    return next(error);
  }

  next();
});

// Function to send OTP via email
const sendOtpEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false, // Use true for port 465
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
      html: `<p>Your OTP is: <b>${otp}</b>. It will expire in <b>10 minutes</b>.</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("OTP email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

// Compile model from schema
const Otp = mongoose.model("Otp", OtpSchema);

module.exports = Otp;
