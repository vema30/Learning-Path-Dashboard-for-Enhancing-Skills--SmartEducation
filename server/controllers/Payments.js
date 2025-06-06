// const { instance } = require("../config/razorpay");
// const Course = require("../models/Course");
// const User = require("../models/User");
// const mailSender = require("../utils/mailSender");
// const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
// const { default: mongoose } = require("mongoose");
// const crypto = require("crypto");

// // // Capture Payment Controller
// exports.capturePayment = async (req, res) => {
//     console.log("hey u r in capturepayment")
//     const { course_id } = req.body;
//     const userId = req.user.id;

//     if (!course_id) {
//         return res.json({
//             success: false,
//             message: 'Please provide valid course ID.',
//         });
//     }

//     let course;
//     try {
//         course = await Course.findById(course_id);
//         if (!course) {
//             return res.json({
//                 success: false,
//                 message: 'Course not found.',
//             });
//         }

//         if (course.studentsEnrolled.includes(userId)) {
//             return res.status(200).json({
//                 success: false,
//                 message: 'Student is already enrolled in this course.',
//             });
//         }
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }

//     const amount = course.price;
//     const currency = "INR";
//     const options = {
//         amount: amount * 100,  // Razorpay expects amount in paise (1 INR = 100 paise)
//         currency,
//         receipt: Date.now().toString(),  // Unique receipt ID
//         notes: {
//             courseId: course_id,
//             userId,
//         }
//     };

//     try {
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);

//         return res.status(200).json({
//             success: true,
//             courseName: course.courseName,
//             courseDescription: course.courseDescription,
//             thumbnail: course.thumbnail,
//             orderId: paymentResponse.id,
//             currency: paymentResponse.currency,
//             amount: paymentResponse.amount,
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: "Could not initiate payment order",
//         });
//     }
// };

// // // Verify Payment Controller
// // exports.verifyPayment = async (req, res) => {
// //     const webhookSecret = "12345678";  // Change this to your actual secret
// //     const signature = req.headers["x-razorpay-signature"];
// //     const shasum = crypto.createHmac("sha256", webhookSecret);
// //     shasum.update(JSON.stringify(req.body));
// //     const digest = shasum.digest("hex");

// //     if (digest === signature) {
// //         console.log("Payment is authorized");

// //         const { courseId, userId } = req.body.payload.payment.entity.notes;

// //         try {
// //             // Enroll the user in the course
// //             const enrolledCourse = await Course.findByIdAndUpdate(
// //                 courseId,
// //                 { $push: { studentsEnrolled: userId } },
// //                 { new: true }
// //             );

// //             if (!enrolledCourse) {
// //                 return res.status(500).json({
// //                     success: false,
// //                     message: "Course not found",
// //                 });
// //             }

// //             console.log(enrolledCourse);

// //             // Add the course to the user's enrolled courses
// //             const enrolledStudent = await User.findByIdAndUpdate(
// //                 userId,
// //                 { $push: { courses: courseId } },
// //                 { new: true }
// //             );

// //             console.log(enrolledStudent);

// //             // Send confirmation email
// //             const emailResponse = await mailSender(
// //                 enrolledStudent.email,
// //                 "Congratulations from CodeHelp",
// //                 "Congratulations! You've successfully enrolled in a new CodeHelp course."
// //             );

// //             console.log(emailResponse);

// //             return res.status(200).json({
// //                 success: true,
// //                 message: "Signature verified and course added",
// //             });

// //         } catch (error) {
// //             console.log(error);
// //             return res.status(500).json({
// //                 success: false,
// //                 message: "Error processing the payment or enrolling the student.",
// //             });
// //         }
// //     } else {
// //         return res.status(400).json({
// //             success: false,
// //             message: "Invalid signature.",
// //         });
// //     }
// // };

// // Send Payment Success Email Controller
// exports.sendPaymentSuccessEmail = async (req, res) => {
//     const { userId, courseId } = req.body;

//     if (!userId || !courseId) {
//         return res.status(400).json({
//             success: false,
//             message: "User ID and Course ID are required",
//         });
//     }

//     try {
//         // Fetch the user details
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found",
//             });
//         }

//         // Fetch the course details
//         const course = await Course.findById(courseId);
//         if (!course) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Course not found",
//             });
//         }

//         // Send confirmation email
//         const emailResponse = await mailSender(
//             user.email,
//             "Congratulations on Enrolling in " + course.courseName,
//             courseEnrollmentEmail(course, user)
//         );

//         console.log(emailResponse);

//         return res.status(200).json({
//             success: true,
//             message: "Payment success email sent",
//         });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: "Error sending email",
//         });
//     }
// };
// exports.verifyPayment = async (req, res) => {
//     // ✅ Check for testMode to allow bypass
//     if (req.body.testMode === true) {
//       const { courses } = req.body;
//       const userId = req.user.id;
  
//       try {
//         for (const courseId of courses) {
//           // Enroll user in each course
//           const enrolledCourse = await Course.findByIdAndUpdate(
//             courseId,
//             { $addToSet: { studentsEnrolled: userId } }, // avoid duplicates
//             { new: true }
//           );
  
//           if (!enrolledCourse) {
//             return res.status(404).json({
//               success: false,
//               message: `Course not found: ${courseId}`,
//             });
//           }
  
//           await User.findByIdAndUpdate(
//             userId,
//             { $addToSet: { courses: courseId } },
//             { new: true }
//           );
  
//           // Optionally send success email
//           await mailSender(
//             req.user.email,
//             `Enrolled in ${enrolledCourse.courseName}`,
//             courseEnrollmentEmail(enrolledCourse, req.user)
//           );
//         }
  
//         return res.status(200).json({
//           success: true,
//           message: "Enrolled in course(s) successfully [Test Mode]",
//         });
//       } catch (error) {
//         console.error("Error in testMode enrollment:", error);
//         return res.status(500).json({
//           success: false,
//           message: "Enrollment failed in test mode",
//         });
//       }
//     }
  
//     // 👇 Regular Razorpay verification logic
//     const webhookSecret = "12345678";
//     const signature = req.headers["x-razorpay-signature"];
//     const shasum = crypto.createHmac("sha256", webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");
  
//     if (digest === signature) {
//       console.log("Payment is authorized");
  
//       const { courseId, userId } = req.body.payload.payment.entity.notes;
  
//       try {
//         const enrolledCourse = await Course.findByIdAndUpdate(
//           courseId,
//           { $addToSet: { studentsEnrolled: userId } },
//           { new: true }
//         );
  
//         const enrolledStudent = await User.findByIdAndUpdate(
//           userId,
//           { $addToSet: { courses: courseId } },
//           { new: true }
//         );
  
//         await mailSender(
//           enrolledStudent.email,
//           "Congratulations from CodeHelp",
//           "Congratulations! You've successfully enrolled in a new CodeHelp course."
//         );
  
//         return res.status(200).json({
//           success: true,
//           message: "Signature verified and course added",
//         });
  
//       } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//           success: false,
//           message: "Error processing the payment or enrolling the student.",
//         });
//       }
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid signature.",
//       });
//     }
//   };
const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const Payment = require("../models/Payment");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const crypto = require("crypto");
require("dotenv").config();

// 📌 Capture Payment (Create Razorpay Order)
exports.capturePayment = async (req, res) => {
  try {
    const { courseId, amount } = req.body;
console.log("details : ",courseId, amount);
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
  
// 🔐 Verify Payment Signature
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, amount } = req.body;

   console.log("req",req.body);
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId || !amount) {
      return res.status(400).json({ success: false, message: "Missing payment information" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Validate the payment signature
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment signature mismatch" });
    }

    // Save payment details to database
    const payment = await Payment.create({
      userId: req.user.id,
      courseId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      status: "SUCCESS",
    });

    // Enroll user in course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Prevent double enrollment
    if (!course.studentsEnrolled.includes(req.user.id)) {
      course.studentsEnrolled.push(req.user.id);
      await course.save();
    }

    // Add course to user's enrolled courses
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.courses.includes(courseId)) {
      user.courses.push(courseId);
      await user.save();
    }

    
    // Send confirmation email
    await mailSender(user.email, "Course Enrollment Confirmation", courseEnrollmentEmail(course, user));

    return res.status(200).json({
      success: true,
      message: "Payment verified and user enrolled successfully",
      paymentId: payment._id,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
// 📧 Send Payment Success Email
// 📧 Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    // Fetch user and course details
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({ success: false, message: "User or Course not found" });
    }

    // Send confirmation email
    await mailSender(user.email, "Course Enrollment Confirmation", courseEnrollmentEmail(course, user));

    return res.status(200).json({
      success: true,
      message: "Payment success email sent",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      success: false,
      message: "Error sending email",
    });
  }
};
