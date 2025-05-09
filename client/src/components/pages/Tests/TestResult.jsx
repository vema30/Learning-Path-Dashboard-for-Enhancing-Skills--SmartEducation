import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const TestResult = () => {
  const { state } = useLocation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <div className=" bg-white shadow-lg rounded-lg p-10 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4 text-blue-700">🎉 Test Submitted!</h2>
        <p className="text-xl text-blue-700">You scored</p>
        <p className="text-5xl font-bold text-blue-700 my-4">{state.score} / {state.total}</p>

        <button
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-2 bg-blue-400 hover:bg-blue-600  rounded transition duration-300"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  )
}

export default TestResult
