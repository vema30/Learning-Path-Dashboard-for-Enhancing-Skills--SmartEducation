import React, { useState } from 'react'
import axios from 'axios'
import { ArrowRight } from 'lucide-react'

const Recommendation = () => {
  const [courseName, setCourseName] = useState('')
  const [courseMap, setCourseMap] = useState({})
  const [error, setError] = useState(false)
  const [showTitle, setShowTitle] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("https://learning-path-dashboard-for-enhancing-7n8z.onrender.com/api/recommend", {
        course: courseName,
      })
      setCourseMap(response.data.coursemap)
      setShowTitle(true)
      setError(false)
    } catch (err) {
      console.error("Error fetching recommendations:", err)
      setError(true)
      setShowTitle(false)
      setCourseMap({})
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 font-sans">
      <nav className="bg-gray-900 text-white p-4 shadow">
        <div className="container mx-auto flex justify-between items-center">
        <div className="w-full flex justify-center items-center p-4 bg-gray-800">
  <a href="/" className="text-5xl font-bold tracking-tight text-white">
    🎓 Course Recommender
  </a>
</div>

          <div className="space-x-4">
           
          </div>
        </div>
      </nav>

      <section className="text-center py-3 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Discover Courses You'll Love
        </h1>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Enter a course name or keyword to get personalized course recommendations from Udemy.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <input
            type="text"
            name="course"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="px-4 py-2 w-72 rounded-lg border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="e.g. Python"
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Recommend <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {showTitle && (
          <h3 className="mt-10 text-lg text-gray-700 font-semibold">
            Top Recommendations for <span className="text-blue-700">"{courseName}"</span>
          </h3>
        )}
      </section>

      <div className="container mx-auto px-6 py-10">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center mb-6">
            <strong>Oops!</strong> No course found for <span className="font-semibold">{courseName}</span>.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-black">
          {Object.keys(courseMap).map((title) => (
            <div key={title} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <p className="text-xl font-semibold text-gray-800 mb-4 line-clamp-2">{title}</p>
              <a
                href={courseMap[title]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                View Course
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Recommendation
