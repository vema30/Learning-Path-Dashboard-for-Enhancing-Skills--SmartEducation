// src/services/operations/studentFeaturesAPI.js
import { toast } from "react-hot-toast";
import axios from "axios";
import { apiConnector } from "../apiconnector";
import {
  paymentFailed,
  paymentStart,
  paymentSuccess,
  verificationStart,
  verificationSuccess,
  verificationFailed,
  setOrderDetails
} from "../../slices/paymentSlice";
import { resetCart } from "../../slices/cartSlice";
import { studentEndpoints } from "../apis";
import rzpLogo from "../../assets/Logo/rzp_logo.png";
const API_URL = "http://localhost:4000/api/v1/payment"; // Adjust API URL as per your backend

// Utility: load Razorpay script with retry
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Script load failed"));

    document.body.appendChild(script);
  });
};

// API: create Razorpay order
const createOrder = async (courseId, amount, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/order`,
      { courseId, amount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
};

// API: verify Razorpay payment
const verifyPayment = async (razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, amount, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/verify`,
      {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        courseId,
        amount
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    throw error;
  }
};

// API: send payment success email
const sendPaymentSuccessEmail = async (userId, courseId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/send-email`,
      { userId, courseId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Handle Razorpay payment success
const handlePaymentSuccess = async (response, courseId, amount, token) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

  const paymentDetails = {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    courseId,
    amount
  };
  console.log("paymeny",paymentDetails);

  try {
    const res = await axios.post("http://localhost:4000/api/v1/payment/verify", paymentDetails, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.data.success) {
      alert("Payment successful and you are enrolled in the course!");
    } else {
      alert("Payment verification failed.");
    }
  } catch (error) {
    console.error("Error in payment verification", error);
    alert("Error verifying payment.");
  }
};

// Main Function: trigger Razorpay payment
export const BuyCourse = (courseId, token) => {
  return async (dispatch) => {
    try {
      // Fetch course details from the backend
      const { data: { data: course } } = await axios.get(`http://localhost:4000/api/v1/course/courses/${courseId}`);
      const price = course.price;

      // Validate course price
      if (!course || isNaN(price) || price <= 0) {
        toast.error("Course price is missing or invalid.");
        return;
      }

      const amount = price * 100; // Convert to paise
      if (isNaN(amount) || amount <= 0) {
        toast.error("Invalid amount");
        return;
      }

      console.log("Amount in Paise:", amount);

      // Create order on backend
      const { data: orderDetails } = await axios.post(
        `${API_URL}/order`,
        { userId: token, courseId, amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const orderId = orderDetails?.order?.id;
      if (!orderId) {
        throw new Error("Order ID not received from backend.");
      }

      await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      console.log("Razorpay Key:", process.env.REACT_APP_RAZORPAY_KEY_ID);

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount,
        currency: "INR",
        name: course.courseName,
        description: course.courseDescription,
        image: rzpLogo,
        order_id: orderId,
        handler: async (response) => {
          console.log("Razorpay response:", response);
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

          if (!razorpay_order_id || !razorpay_signature) {
            console.error("Missing Razorpay response fields", response);
            toast.error("Payment response missing required fields.");
            return;
          }

          await handlePaymentSuccess(response, courseId, amount, token);
        },
        prefill: {
          email: localStorage.getItem("email") || "",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      console.log("Payment initiated");
      dispatch(resetCart());

    } catch (error) {
      dispatch(paymentFailed(error.message));
      toast.error(error.message);
    }
  };
};

export { createOrder, verifyPayment, sendPaymentSuccessEmail };
