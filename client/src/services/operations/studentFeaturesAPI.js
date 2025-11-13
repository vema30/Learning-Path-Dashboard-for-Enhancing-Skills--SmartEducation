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
const API_URL = "http://localhost:4000/api/v1/payments"; // Adjust API URL as per your backend

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
const verifyPayment = async (razorpay_order_id, razorpay_payment_id, razorpay_signature, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/verify`,
      {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
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


// Main Function: trigger Razorpay payment
export const BuyCourse = (courseId, token) => {
  return async (dispatch) => {   // This is the corrected structure

    try {
      // Fetch course details from backend
      const { data: course } = await axios.get(`http://localhost:4000/api/v1/course/${courseId}`);
      const amount = course.price * 100;  // Convert to paise for Razorpay

      // Create the order in the backend
      const { data: orderDetails } = await axios.post("http://localhost:4000/api/v1/payments/order", {
        userId: token,
        courseId,
        amount
      });

      // Load Razorpay script dynamically
      await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      // Configure Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,  // Use env variable for Razorpay key
        amount,
        currency: "INR",
        name: course.courseName,
        description: course.courseDescription,
        image: rzpLogo,
        order_id: orderDetails.id,
        handler: async (response) => {
          dispatch(verificationStart());
          try {
            await verifyPayment(response);
            dispatch(verificationSuccess());
            dispatch(resetCart());  // Reset cart after successful payment
          } catch (error) {
            dispatch(verificationFailed(error.message));
          }
        },
        prefill: {
          email: localStorage.getItem("email") || "",  // Prefill email from local storage
        }
      };

      // Open Razorpay payment window
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      // Handle errors
      dispatch(paymentFailed(error.message));
      toast.error(error.message);
    }
  };
};
export { createOrder, verifyPayment, sendPaymentSuccessEmail };
