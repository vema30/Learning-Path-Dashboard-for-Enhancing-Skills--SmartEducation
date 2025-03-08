import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../slices/authSlice"; // Import login action
import HighlightText from "./HighlightText";
import { BiSolidHide } from "react-icons/bi";
import CTbutton from "./CTButton";
import { Link } from "react-router-dom";
import login from "../../assets/Images/login.webp";

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth); // Get login state from Redux

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("Student"); // Track selected tab

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen items-center justify-center gap-6">
      {/* Left Section */}
      <div className="w-full md:w-[50%] flex flex-col gap-4 p-8 border-2 border-blue-300 justify-center  lg:ml-20">
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

        {/* Email Input */}
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">Email</span>
          <input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border rounded-md mt-1"
            required
          />
        </label>

        {/* Password Input */}
        <label className="flex flex-col relative">
          <span className="text-sm font-medium text-gray-600">Password</span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border rounded-md w-full mt-1 pr-10"
            required
          />
          <BiSolidHide
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-10 cursor-pointer text-gray-500"
          />
        </label>

        {/* Display Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Forgot Password */}
        <Link to="/forgot-password" className="text-blue-500 text-sm">
          Forgot password?
        </Link>

        {/* Sign In Button */}
        <CTbutton  active={true} type="submit" onClick={handleLogin} disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </CTbutton>
      </div>

      {/* Right Section (Image) */}
      <div className="w-full md:w-[50%] hidden md:block  flex justify-center  p-4">
        <img src={login} alt="Login Visual" className="w-3/4 md:w-[80%]  rounded-md" />
      </div>
    </div>
  );
};

export default Login;
