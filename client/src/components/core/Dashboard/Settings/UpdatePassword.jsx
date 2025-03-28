import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { changePassword } from "../../../../services/operations/SettingsAPI";
import IconBtn from "../../../common/IconBtn";

export default function UpdatePassword() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // Watch new password to validate confirm password match
  const newPassword = watch("newPassword");

  const submitPasswordForm = async (data) => {
    console.log("password Data - ", data);
    try {
      await changePassword(token, data);
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitPasswordForm)} className="space-y-8">
      <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 text-white">
        <h2 className="text-lg font-semibold text-richblack-5">Password</h2>

        {/* Current Password */}
        <div className="relative flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="oldPassword" className="text-sm font-semibold text-white">
            Current Password
          </label>
          <input
            type={showOldPassword ? "text" : "password"}
            name="oldPassword"
            id="oldPassword"
            placeholder="Enter Current Password"
            className="w-full p-3 rounded-md bg-richblack-700 text-white border-[1px] border-richblack-600 focus:border-white focus:outline-none"
            {...register("oldPassword", { required: "Current password is required" })}
          />
          <span
            onClick={() => setShowOldPassword((prev) => !prev)}
            className="absolute right-3 top-[38px] z-[10] cursor-pointer"
          >
            {showOldPassword ? (
              <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
            ) : (
              <AiOutlineEye fontSize={24} fill="#AFB2BF" />
            )}
          </span>
          {errors.oldPassword && (
            <span className="mt-1 text-sm text-yellow-100">
              Please enter your Current Password.
            </span>
          )}
        </div>

        {/* New Password */}
        <div className="relative flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="newPassword" className="text-sm font-semibold text-white">
            New Password
          </label>
          <input
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            id="newPassword"
            placeholder="Enter New Password"
            className="w-full p-3 rounded-md bg-richblack-700 text-white border-[1px] border-richblack-600 focus:border-white focus:outline-none"
            {...register("newPassword", { required: "New password is required" })}
          />
          <span
            onClick={() => setShowNewPassword((prev) => !prev)}
            className="absolute right-3 top-[38px] z-[10] cursor-pointer"
          >
            {showNewPassword ? (
              <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
            ) : (
              <AiOutlineEye fontSize={24} fill="#AFB2BF" />
            )}
          </span>
          {errors.newPassword && (
            <span className="mt-1 text-sm text-yellow-100">
              Please enter your New Password.
            </span>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="relative flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="confirmPassword" className="text-sm font-semibold text-white">
            Confirm New Password
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm New Password"
            className="w-full p-3 rounded-md bg-richblack-700 text-white border-[1px] border-richblack-600 focus:border-white focus:outline-none"
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === newPassword || "Passwords do not match",
            })}
          />
          <span
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-[38px] z-[10] cursor-pointer"
          >
            {showConfirmPassword ? (
              <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
            ) : (
              <AiOutlineEye fontSize={24} fill="#AFB2BF" />
            )}
          </span>
          {errors.confirmPassword && (
            <span className="mt-1 text-sm text-yellow-100">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => navigate("/dashboard/my-profile")}
          className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50 hover:bg-richblack-600"
        >
          Cancel
        </button>

        <IconBtn type="submit" text="Update" onClick={handleSubmit(submitPasswordForm)} />
      </div>
    </form>
  );
}
