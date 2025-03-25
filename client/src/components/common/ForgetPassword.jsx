import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/auth/reset-password-token",
        { email }
      );

      if (response.data.success) {
        setSuccessMessage("Reset password link sent to your email!");
      } else {
        throw new Error(response.data.message || "Failed to send reset link");
      }
    } catch (error) {
      console.error("Error sending reset link:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  from-blue-500 to-white">
      <div className="p-10 rounded-3xl shadow-2xl w-full max-w-md bg-gradient-to-bl from-blue-200 to-white relative border-4 border-dashed border-blue-400">
        <h2 className="text-4xl font-bold text-blue-900 mb-6 text-center drop-shadow-xl">
          📧 Forget Password
        </h2>
        <p className="text-center text-lg mb-6 text-gray-700">
          Enter your registered email to receive the reset link.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-lg font-semibold text-blue-900">
              Registered Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 p-3 w-full border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 bg-blue-50 placeholder-blue-400 shadow-md"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-4 focus:ring-green-300 shadow-xl"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {successMessage && <p className="mt-6 text-green-800 text-center text-lg font-bold">{successMessage}</p>}
        {errorMessage && <p className="mt-6 text-red-800 text-center text-lg font-bold">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default ForgetPassword;
