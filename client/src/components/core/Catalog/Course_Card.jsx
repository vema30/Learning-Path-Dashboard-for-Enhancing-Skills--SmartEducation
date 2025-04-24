import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import GetAvgRating from "../../../utils/avgRating"
import RatingStars from "../../common/RatingStars"

function Course_Card({ course, Height }) {
  const [avgReviewCount, setAvgReviewCount] = useState(0)

  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews)
    setAvgReviewCount(count)
  }, [course])

  return (
    <Link to={`/courses/${course._id}`}>
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#1e293b] to-[#0f172a] shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:scale-[1.02]">
        <div>
          <img
            src={course?.thumbnail}
            alt="Course Thumbnail"
            className={`${Height} w-full object-cover`}
          />
        </div>

        <div className="flex flex-col gap-2 px-4 py-3 text-white">
          <p className="text-lg font-semibold line-clamp-1">{course?.courseName}</p>
          <p className="text-sm text-slate-300 line-clamp-1">
            {course?.instructor?.firstName} {course?.instructor?.lastName}
          </p>

          <div className="flex items-center gap-2 text-yellow-400 text-sm">
            <span>{avgReviewCount.toFixed(1)}</span>
            <RatingStars Review_Count={avgReviewCount} />
            <span className="text-slate-400">({course?.ratingAndReviews?.length})</span>
          </div>

          <p className="text-base font-medium text-green-400">Rs. {course?.price}</p>
        </div>
      </div>
    </Link>
  )
}

export default Course_Card
