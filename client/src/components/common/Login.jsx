import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import HighlightText from "./HighlightText";
import loginIMG from "../../assets/Images/login.webp";
import { login } from "../../services/operations/authAPI";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("Student");

  const validateForm = () => {
    if (!email || !password) {
      return "Please fill in all fields.";
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return "Please enter a valid email address.";
    }
    return null;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      console.error(validationError);
      return;
    }
    dispatch(login(email, password, navigate));
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen items-center justify-center gap-6">
      {/* Left Section */}
      <div className="w-full md:w-[50%] flex flex-col gap-4 p-8 border-2 border-blue-300 justify-center lg:ml-20">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-gray-600">
          Build skills for today, tomorrow & beyond.{" "}
          <HighlightText text="Education to future-proof your career." />
        </p>

        {/* Tabs for Student & Instructor */}
        <div className="flex gap-4">
          {["Student", "Instructor"].map((type) => (
            <div
              key={type}
              className={`cursor-pointer border-2 px-4 py-2 rounded-md transition-all duration-200 ${
                userType === type
                  ? "border-blue-500 bg-blue-100 text-blue-800"
                  : "border-gray-300 text-gray-500"
              }`}
              onClick={() => setUserType(type)}
            >
              {type}
            </div>
          ))}
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-6 flex w-full flex-col gap-y-4">
          {/* Email Input */}
          <label className="w-full">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Email Address <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-white placeholder:text-richblack-200"
            />
          </label>

          {/* Password Input */}
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-white placeholder:text-richblack-200"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
            <button
              type="button"
              onClick={() => navigate("/forget-password")}
              className="mt-1 ml-auto max-w-max text-xs text-blue-100 hover:text-blue-300 transition-colors"
            >
              Forgot Password?
            </button>
          </label>

          {/* Display Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 h-full w-fit p-3 justify-center rounded-md hover:bg-yellow-600 transition-colors"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>

      {/* Right Section (Image) */}
      <div className="w-full md:w-[50%] hidden md:block justify-center p-4">
        <img
          src={loginIMG}
          alt="Login Visual"
          className="w-3/4 md:w-[80%] rounded-md"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default Login;