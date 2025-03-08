import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      // Replace with your actual API endpoint
      const response = await axios.post("https://your-api.com/password-reset", { email });
      setMessage(response.data.message || "Password reset link sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 text-black">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 text-blue-300">Reset Password</h2>
        <p className="text-gray-600 text-center mt-2">Enter your email to receive a password reset link.</p>

        {message && <p className="text-green-600 text-center mt-4">{message}</p>}
        {error && <p className="text-red-600 text-center mt-4">{error}</p>}

        <form onSubmit={handleReset} className="mt-6">
          <label className="block text-gray-700">Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md text-black outline-none"
            required
          />

          <button
            type="submit"
            className="w-full mt-4 p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Send Reset Link
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Remember your password?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
