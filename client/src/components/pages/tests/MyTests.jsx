import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const MyTests = () => {
  const [quizzes, setQuizzes] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    // Set the full backend URL including localhost and port
    axios.get('http://localhost:4000/api/quizzes')  // Ensure this matches your backend endpoint
      .then(res => setQuizzes(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="grid grid-cols-3 gap-6 p-4">
      {quizzes.map(quiz => (
        <div key={quiz._id} className="border rounded-lg p-4 shadow">
          <img src={quiz.image} alt={quiz.title} className="w-full h-40 object-cover mb-2 rounded" />
          <h2 className="text-xl font-bold">{quiz.title}</h2>
          <p className="text-sm text-gray-600">Category: {quiz.category?.name}</p>
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => navigate(`/quiz/${quiz._id}`)}
          >
            Start Test
          </button>
        </div>
      ))}
    </div>
  )
}

export default MyTests
