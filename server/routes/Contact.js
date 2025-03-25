const express = require("express");
const router = express.Router();
const mailSender = require("../utils/mailSender");
require("dotenv").config();
router.post("/contact", async (req, res) => {
    console.log("hey");
  const { name, email, message } = req.body;

  try {
    // Send email using the mailSender utility
    await mailSender(
      process.env.MAIL_USER, // Replace with your email
      "New Contact Form Submission",
      `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      `<p><strong>Name:</strong> ${name}</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Message:</strong> ${message}</p>`
    );

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

module.exports = router;