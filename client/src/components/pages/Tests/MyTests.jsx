import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import CreateTests from './CreateTests'

const MyTests = () => {
  const [taken, setTaken] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.profile)
  const handleDelete = (quizId) => {
    if (!quizId) {
      console.error("Quiz ID is missing!");
      return;
    }
  
    // Confirm before deleting
    if (window.confirm("Are you sure you want to delete this test?")) {
      axios.delete(`http://localhost:4000/api/test/taken/${user._id}/${quizId}`)
        .then(res => {
          setTaken(res.data); // Update state with the new takenTests
        })
        .catch(err => console.error("Error deleting test:", err));
    }
  };
  
  useEffect(() => {
    // Fetch all available quizzes
    axios.get('http://localhost:4000/api/test/quizzes')
      .then(res => setQuizzes(res.data))
      .catch(err => console.error(err))

    // If student, fetch taken tests
    if (user?.accountType === "Student") {
      axios.get(`http://localhost:4000/api/test/taken?userId=${user._id}`)
        .then(res => setTaken(res.data.takenTests))
        .catch(err => console.error(err))
    }
  }, [user])

  if (user?.accountType === "Instructor") {
    return (
      <div className="min-h-screen bg-blue-800 p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-100">Create Quiz</h1>
        <CreateTests />
      </div>
    )
  }

  // Student View
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Quizzes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {quizzes.map(quiz => (
          <div key={quiz._id} className="bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={quiz.image}
              alt={quiz.title}
              className="w-40 h-40 object-fit p-4 flex"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-blue-600">{quiz.title}</h2>
              <p className="text-sm text-blue-400 mt-1">Category: {quiz.category?.name || 'Uncategorized'}</p>
              <button
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
                onClick={() => navigate(`/quiz/${quiz._id}`)}
              >
                Start Test
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Taken Tests</h2>
      {taken.length > 0 ? (
        <ul className="space-y-4">
        {taken.map((test, idx) => (
  <li key={idx} className="bg-white text-gray-800 p-4 rounded shadow text-black">
    <h3 className="text-lg font-bold">{test.quizId?.title || 'Unknown Quiz'}</h3>
    <p>Score: {test.score} / {test.total}</p>
    <p>Date: {new Date(test.date).toLocaleString()}</p>

    <div className="mt-2 space-x-2">
      <button
        className="bg-caribbeangreen-600 hover:bg-caribbeangreen-700 text-white py-1 px-4 rounded"
        onClick={() => navigate(`/quiz/${test.quizId?._id}`)}
      >
        Try Again
      </button>

      <button
        className="bg-red-600 hover:bg-gray-700 text-black py-1 px-4 rounded"
        onClick={() => handleDelete(test.quizId?._id)}
      >
        Delete
      </button>
    </div>
  </li>
))}


        </ul>
      ) : (
        <p className="text-gray-600">You haven’t taken any tests yet.</p>
      )}
    </div>
  )
}

export default MyTests
