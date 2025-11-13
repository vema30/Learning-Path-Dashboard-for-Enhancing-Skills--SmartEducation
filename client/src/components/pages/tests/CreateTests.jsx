import React, { useState, useEffect } from 'react'
import axios from 'axios'

const CreateTests = () => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState('')
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }
  ])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    // Fetch categories from backend (if using dynamic categories)
    const fetchCategories = async () => {
      const res = await axios.get('http://localhost:4000/api/categories')
      setCategories(res.data)
    }
    fetchCategories()
  }, [])

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions]
    updated[index][field] = value
    setQuestions(updated)
  }

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions]
    updated[qIndex].options[oIndex] = value
    setQuestions(updated)
  }

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }
    ])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:4000/api/quizzes', {
        title,
        category,
        image,
        questions
      })
      alert('Quiz created successfully!')
      setTitle('')
      setCategory('')
      setImage('')
      setQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }])
    } catch (err) {
      console.error(err)
      alert('Error creating quiz')
    }
  }

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Create New Quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full rounded"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <div>
          <h2 className="font-semibold mb-2">Questions</h2>
          {questions.map((q, idx) => (
            <div key={idx} className="border p-3 rounded mb-4">
              <input
                type="text"
                placeholder={`Question ${idx + 1}`}
                value={q.questionText}
                onChange={(e) => handleQuestionChange(idx, 'questionText', e.target.value)}
                className="border p-2 w-full mb-2 rounded"
                required
              />
              {q.options.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, i, e.target.value)}
                  className="border p-2 w-full mb-1 rounded"
                  required
                />
              ))}
              <label className="block mt-2">
                Correct Answer Index:
                <input
                  type="number"
                  min="0"
                  max="3"
                  value={q.correctAnswerIndex}
                  onChange={(e) =>
                    handleQuestionChange(idx, 'correctAnswerIndex', parseInt(e.target.value))
                  }
                  className="border p-1 ml-2 w-16 rounded"
                  required
                />
              </label>
            </div>
          ))}
          <button type="button" onClick={addQuestion} className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Question
          </button>
        </div>
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
          Create Quiz
        </button>
      </form>
    </div>
  )
}

export default CreateTests
