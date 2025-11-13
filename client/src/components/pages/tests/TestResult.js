import React from 'react'
import { useLocation } from 'react-router-dom'

const TestResult = () => {
  const { state } = useLocation()

  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold">Test Submitted!</h2>
      <p className="text-lg mt-4">You scored {state.score} out of {state.total}</p>
    </div>
  )
}

export default TestResult
