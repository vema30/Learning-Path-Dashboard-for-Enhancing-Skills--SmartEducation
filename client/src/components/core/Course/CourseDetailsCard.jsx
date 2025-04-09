import React from "react"
import copy from "copy-to-clipboard"
import { toast } from "react-hot-toast"
import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { addToCart } from "../../../slices/cartSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"

function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    thumbnail: ThumbnailImage,
    price: CurrentPrice,
    _id: courseId,
  } = course

  const handleShare = () => {
    copy(window.location.href)
    toast.success("Link copied to clipboard")
  }

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }
    if (token) {
      dispatch(addToCart(course))
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  const isStudentEnrolled = (course?.studentsEnrolled || []).includes(user?._id)

  return (
    <div className="flex flex-col gap-6 rounded-xl bg-richblack-700 p-5 text-richblack-5 shadow-lg max-w-md w-full mx-auto">
      {/* Thumbnail */}
      <img
        src={ThumbnailImage}
        alt={course?.courseName}
        className="h-[250px] w-full rounded-xl object-cover"
      />

      {/* Price */}
      <div className="text-3xl font-bold text-richblack-5">₹{CurrentPrice}</div>

      {/* Buttons */}
      <div className="flex flex-col gap-4">
        <button
          className="w-full rounded-md bg-yellow-400 py-2 font-semibold text-richblack-900 hover:bg-yellow-300 transition duration-200"
          onClick={
            user && isStudentEnrolled
              ? () => navigate("/dashboard/enrolled-courses")
              : handleBuyCourse
          }
        >
          {user && isStudentEnrolled ? "Go To Course" : "Buy Now"}
        </button>

        {(!user || !isStudentEnrolled) && (
          <button
            onClick={handleAddToCart}
            className="w-full rounded-md border border-richblack-600 bg-richblack-800 py-2 font-semibold text-white hover:bg-richblack-600 transition duration-200"
          >
            Add to Cart
          </button>
        )}
      </div>

      {/* Guarantee */}
      <p className="text-center text-sm text-richblack-200">
        30-Day Money-Back Guarantee
      </p>

      {/* Course Includes */}
      <div>
        <p className="text-lg font-semibold text-richblack-5 mb-2">This Course Includes:</p>
        <div className="flex flex-col gap-2 text-sm text-caribbeangreen-100">
          {(course?.instructions || []).map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <BsFillCaretRightFill className="mt-[2px]" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Share Button */}
      <div className="text-center">
        <button
          className="flex items-center justify-center gap-2 text-yellow-100 hover:text-yellow-200 transition"
          onClick={handleShare}
        >
          <FaShareSquare size={16} /> Share
        </button>
      </div>
    </div>
  )
}

export default CourseDetailsCard
