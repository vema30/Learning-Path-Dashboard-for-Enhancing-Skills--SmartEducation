import React from "react";
import {
  createOrder,
  verifyPayment,
  sendPaymentSuccessEmail,
} from "../../services/operations/studentFeaturesAPI";
import { apiConnector } from "../../services/apiconnector";

const PaymentPage = ({ courseId, amount, token }) => {
  const handlePayment = async () => {
    try {
      const response = await apiConnector(
        "POST",
        "/api/v1/payments/order",
        { courseId, amount },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      const order = response.data.order; // ✅ FIXED: define 'order' from response

      console.log("amount,id", amount, courseId);

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        handler: async function (response) {
          const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
          } = response;

          await verifyPayment(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            token
          );

          const user = JSON.parse(localStorage.getItem("user"));
          const userId = user._id || user.id;

          await sendPaymentSuccessEmail(userId, courseId, token);
          alert("Payment successful!");
        },
        prefill: {
          name: "Student Name",
          email: "student@example.com",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed!");
    }
  };

  return <button onClick={handlePayment}>Pay Now</button>;
};

export default PaymentPage;
