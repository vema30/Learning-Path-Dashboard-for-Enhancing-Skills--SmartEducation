import React, { useState } from "react";
import axios from "axios";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { FaChevronDown } from "react-icons/fa";
import HighlightText from "./HighlightText";
import CTButton from "../common/CTButton";
import logo from "../../assets/Images/signup.webp";
import countrycode from "../../data/countrycode.json";

export const Signup = () => {
  const [userType, setUserType] = useState("Student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen items-center justify-center gap-6 bg-gray-100 p-9 rounded-lg">
      {/* Left Section */}
      <div className="w-full md:w-[50%] flex flex-col gap-4 p-8 border-2 border-blue-200 border-gray-300 rounded-lg ">
        <h2 className="text-2xl font-bold text-gray-800">
          Join the millions learning to code with StudyNotion for free
        </h2>
        <p className="text-gray-600">
          Build skills for today, tomorrow, and beyond.{" "}
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

        {/* Name Fields */}
        <div className="flex gap-4">
          <label className="flex flex-col w-full">
            <span className="text-sm font-medium text-gray-600">First Name</span>
            <input
              type="text"
              placeholder="Enter first name"
              className="p-3 border border-gray-300 rounded-md mt-1 text-black outline-none"
            />
          </label>
          <label className="flex flex-col w-full">
            <span className="text-sm font-medium text-gray-600">Last Name</span>
            <input
              type="text"
              placeholder="Enter last name"
              className="p-3 border border-gray-300 rounded-md mt-1 text-black outline-none"
            />
          </label>
        </div>

        {/* Email Input */}
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">Email Address</span>
          <input
            type="email"
            placeholder="Enter email address"
            className="p-3 border border-gray-300 rounded-md mt-1 text-black outline-none"
          />
        </label>

        {/* Country Code & Phone Number */}
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">Phone Number</span>
          <div className="flex items-center border border-gray-300 rounded-md mt-1 overflow-hidden">
            <div className="relative w-24 border-r border-gray-300 bg-white">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="p-3 w-full bg-white text-black cursor-pointer appearance-none rounded-md outline-none"
              >
                {countrycode.map((code) => (
                  <option key={code.code} value={code.code}>
                    {code.code}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-2 top-4 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Enter phone number"
              className="p-3 flex-1 text-black outline-none bg-white"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </label>

        {/* Password Fields */}
        <label className="flex flex-col relative">
          <span className="text-sm font-medium text-gray-600">Create Password</span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            className="p-3 border border-gray-300 rounded-md w-full mt-1 pr-10 text-black outline-none"
          />
          {showPassword ? (
            <BiSolidShow
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 cursor-pointer text-gray-500"
            />
          ) : (
            <BiSolidHide
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 cursor-pointer text-gray-500"
            />
          )}
        </label>

        <label className="flex flex-col relative">
          <span className="text-sm font-medium text-gray-600">Confirm Password</span>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            className="p-3 border border-gray-300 rounded-md w-full mt-1 pr-10 text-black outline-none"
          />
          {showConfirmPassword ? (
            <BiSolidShow
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-10 cursor-pointer text-gray-500"
            />
          ) : (
            <BiSolidHide
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-10 cursor-pointer text-gray-500"
            />
          )}
        </label>

        {/* Create Account Button */}
        <CTButton active={true} className="rounded-md">Create Account</CTButton>
      </div>

      {/* Right Section (Image) */}
      <div className="w-full md:w-[50%] flex justify-center border-2 border-gray-300 rounded-lg p-4 shadow-lg bg-white">
        <img src={logo} alt="Signup Visual" className="w-3/4 md:w-[80%] rounded-lg" />
      </div>
    </div>
  );
};

export default Signup;
