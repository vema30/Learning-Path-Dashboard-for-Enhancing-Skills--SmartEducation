import React from 'react';
import CTButton from './CTButton';
import { FaCheckCircle } from "react-icons/fa";

const ResetComplete = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <FaCheckCircle className="text-green-500 text-4xl" />

      <h1 className="text-2xl font-bold">Password Reset Successful</h1>
      <p className="text-gray-600 text-center">
        Your password has been successfully reset. You can now log in with your new password.
      </p>

      <CTButton linkTo="/login" active={true} className="w-full max-w-sm">
        Back to Login
      </CTButton>
    </div>
  );
};

export default ResetComplete;
