const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587, // Default SMTP port (change if needed)
      secure: false, // Use `true` for port 465, `false` for others
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.MAIL_USER, // Ensure this matches the authenticated sender
      to: email,
      subject: title,
      html: body
    };

    const info = await transporter.sendMail(mailOptions); // Await for the result
    console.log("Email sent: ", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Throwing error for better debugging
  }
};

module.exports = mailSender;
