import React from 'react'
import CTButton from './CTButton'
import { FaArrowLeft } from "react-icons/fa";

const CheckEmail = () => {
  return (
    <div className='flex flex-col justify-center items-center p-5 space-y-4'>
      <div className='p-2 text-center'>
        <div className='font-bold text-xl'>Check Email</div>
        <div>We have sent the reset email to <span className="font-medium">youremailaccount@gmail.com</span></div>
      </div>

      <div className='text-center w-[300px]'>
        <CTButton className="text-lg px-6 py-2 w-[300px]" active={true}>
          Resend Email
        </CTButton>
      </div>

      <div className='flex justify-center'>
        <CTButton linkto="/login">
          <div className='flex flex-row justify-center items-center space-x-2'>
            <FaArrowLeft />
            <span>Back to Login</span>
          </div>
        </CTButton>
      </div>
    </div>
  )
}

export default CheckEmail
