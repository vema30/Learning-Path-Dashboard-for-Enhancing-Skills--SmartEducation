import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const response = await axios.post(
        "http://localhost:4000/api/v1/auth/reset-password",
        { token, password, confirmPassword }
      );

      if (response.data.success) {
        setSuccessMessage("Password reset successfully!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        throw new Error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setErrorMessage(
        error.response?.data?.message ||
        "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-white">
      <div className="p-10 rounded-3xl shadow-2xl w-full max-w-md bg-gradient-to-bl from-blue-200 to-white relative border-4 border-dashed border-blue-400">
        <h2 className="text-4xl font-bold text-blue-900 mb-6 text-center drop-shadow-xl">
          🔒 Reset Your Password
        </h2>
        <p className="text-center text-lg mb-6 text-gray-700">
          Please enter a new password to reset your account.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-lg font-semibold text-blue-900">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 p-3 w-full border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 bg-blue-50 placeholder-blue-400 shadow-md"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-lg font-semibold text-blue-900">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-2 p-3 w-full border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 bg-blue-50 placeholder-blue-400 shadow-md"
              placeholder="Confirm new password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-4 focus:ring-green-300 shadow-xl"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        {successMessage && <p className="mt-6 text-green-800 text-center text-lg font-bold">{successMessage}</p>}
        {errorMessage && <p className="mt-6 text-red-800 text-center text-lg font-bold">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
