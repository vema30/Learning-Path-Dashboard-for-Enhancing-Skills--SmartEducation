// src/pages/CourseDetailPage.jsx
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
// import { getFullCourseDetails } from "../../services/operations/courseDetailsAPI" // Adjust path as needed

const CourseDetailPage = () => {
  const { courseId } = useParams()
  const [courseData, setCourseData] = useState(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // const data = await getFullCourseDetails(courseId)
        const data=null;
        setCourseData(data)
      } catch (err) {
        console.error("Error fetching course details:", err)
      }
    }

    fetchCourse()
  }, [courseId])

  if (!courseData) return <div className="text-white">Loading course...</div>

  return (
    <div className="p-4 text-white">
      <h1 className="text-3xl font-bold mb-2">{courseData.courseName}</h1>
      <p className="text-gray-300 mb-4">{courseData.courseDescription}</p>
      {/* Add more course details here */}
    </div>
  )
}

export default CourseDetailPage
