import React, { useState } from 'react';
import CTButton from './CTButton';
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";

export const NewPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation checks
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMinLength = password.length >= 8;
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Choose New Password</h1>
        <p className="text-gray-600">Almost done. Enter your new password and you're all set.</p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        {/* New Password */}
        <label htmlFor="new-password" className="block font-medium">New Password</label>
        <div className="relative">
          <input
            id="new-password"
            type={showPassword ? "text" : "password"}
            className="w-full p-2 border rounded-md focus:outline-blue-500 text-black pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash className='text-black' /> : <FaEye className='text-black' />}
          </button>
        </div>

        {/* Confirm Password */}
        <label htmlFor="confirm-password" className="block font-medium">Confirm New Password</label>
        <div className="relative">
          <input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            className="w-full p-2 border rounded-md focus:outline-blue-500 text-black pr-10"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash className='text-black' /> : <FaEye className='text-black' />}
          </button>
        </div>

        {/* Password Requirements */}
        <div className="mt-2 text-sm">
          <div className={`flex items-center ${hasLowercase ? 'text-green-600' : 'text-red-600'}`}>
            {hasLowercase ? '✅' : '❌'} One lowercase letter
          </div>
          <div className={`flex items-center ${hasUppercase ? 'text-green-600' : 'text-red-600'}`}>
            {hasUppercase ? '✅' : '❌'} One uppercase letter
          </div>
          <div className={`flex items-center ${hasDigit ? 'text-green-600' : 'text-red-600'}`}>
            {hasDigit ? '✅' : '❌'} One digit
          </div>
          <div className={`flex items-center ${hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
            {hasSpecialChar ? '✅' : '❌'} One special character (!@#$%^&*)
          </div>
          <div className={`flex items-center ${hasMinLength ? 'text-green-600' : 'text-red-600'}`}>
            {hasMinLength ? '✅' : '❌'} At least 8 characters
          </div>
          <div className={`flex items-center ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
            {passwordsMatch ? '✅ Passwords match' : '❌ Passwords do not match'}
          </div>
        </div>
      </div>

      <CTButton active={true} className="w-full max-w-sm">Reset Password</CTButton>

      <div className="flex justify-center">
        <CTButton linkto="/login">
          <div className="flex flex-row justify-center items-center space-x-2">
            <FaArrowLeft />
            <span>Back to Login</span>
          </div>
        </CTButton>
      </div>
    </div>
  );
};
