const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const Payment = require("../models/Payment");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const crypto = require("crypto");

// 📌 Capture Payment (Create Razorpay Order)
exports.capturePayment = async (req, res) => {
  try {
    const { courseId, amount } = req.body;
console.log("details",courseId,amount);
    if (!courseId || !amount) {
      return res.status(400).json({ success: false, message: "Missing courseId or amount" });
    }

    const options = {
      amount: amount, // frontend should send amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return res.status(500).json({ success: false, message: "Unable to create order" });
  }
};

// 🔐 Verify Payment Signature
exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, message: "Invalid payment details" });
  }

  try {
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    return res.status(200).json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📧 Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({ success: false, message: "User or Course not found" });
    }

    await mailSender(user.email, "Course Enrollment Confirmation", courseEnrollmentEmail(course, user));

    return res.status(200).json({ success: true, message: "Payment success email sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ success: false, message: "Email sending failed" });
  }
};
