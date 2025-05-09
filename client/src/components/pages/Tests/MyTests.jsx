import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux';
import CreateTests from './CreateTests';
const MyTests = () => {
  const [quizzes, setQuizzes] = useState([])
  const navigate = useNavigate()
const { user } = useSelector((state) => state.profile);
console.log("user",user.accountType);
  useEffect(() => {
    axios.get('http://localhost:4000/api/test/quizzes')
      .then(res => setQuizzes(res.data))
      .catch(err => console.error(err))
  }, [])
if(user.accountType==="Instructor"){
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-500" >Create Quiz</h1>
      <CreateTests />
       
    </div>
  )

}
  return (

    <div className="min-h-screen bg-gray-100 p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center ">Available Quizzes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {quizzes.map(quiz => (
          <div key={quiz._id} className="bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={quiz.image}
              alt={quiz.title}
              className="w-full h-40 object-fit"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-blue-400">{quiz.title}</h2>
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
    </div>
  )
}

export default MyTests
