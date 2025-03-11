import React, { useState, useRef } from 'react';
import CTButton from './CTButton';
import { FaArrowLeft } from "react-icons/fa";

const VerifyEmail = () => {
  const [code, setCode] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return; // Only allow numbers

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Verify Your Email</h1>
        <p className="text-gray-600">
          We’ve sent a verification email to <strong>your@email.com</strong>.  
          Please check your inbox and enter the verification code below.
        </p>
      </div>

      {/* 6-digit input fields */}
      <div className="flex space-x-2 mt-4 text-black">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-12 text-center text-xl font-bold border rounded-md focus:outline-blue-500"
          />
        ))}
      </div>

      <div className="mt-4">
        <CTButton active={true}>verify and register</CTButton>
      </div>
      <div className='flex justify-center m-4'>
        <CTButton linkto="/login">
          <div className='flex flex-row justify-center items-center space-x-2'>
            <FaArrowLeft />
            <span>Back to Login</span>
          </div>
        </CTButton>
        </div>


      <div className="mt-6 text-gray-500">
        <p>Didn't receive an email? Check your spam folder.</p>
      </div>
    </div>
  );
};

export default VerifyEmail;
