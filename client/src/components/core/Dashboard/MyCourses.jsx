import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import CoursesTable from "./InstructorCourses/CoursesTable"

export default function MyCourses() {
  const { token } = useSelector((state) => state.auth)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await fetchInstructorCourses(token)
      console.log("result", result)
      if (result) {
        setCourses(result)
      }
    }
    fetchCourses()
  }, [token])

  return (
    <div>
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
        <Link
          to="/dashboard/add-course"
          className="flex items-center gap-x-2 rounded-md bg-yellow-50 px-4 py-2 text-richblack-900 font-semibold transition-all hover:scale-95"
        >
          <VscAdd size={20} />
          <span>Add New Course</span>
        </Link>
      </div>
      {courses && <CoursesTable courses={courses} setCourses={setCourses} />}
    </div>
  )
}
