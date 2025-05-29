import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const EditTest = () => {
  const { testId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate=useNavigate();
  useEffect(() => {
    axios.get(`http://localhost:4000/api/test/${testId}`).then(res => setQuiz(res.data));
    axios.get('http://localhost:4000/categories1').then(res => setCategories(res.data.categories));
  }, [testId]);

  const handleChange = (field, value) => setQuiz({ ...quiz, [field]: value });

  const handleQuestionChange = (i, field, value) => {
    const updated = [...quiz.questions];
    updated[i][field] = value;
    setQuiz({ ...quiz, questions: updated });
  };

  const handleOptionChange = (qi, oi, value) => {
    const updated = [...quiz.questions];
    updated[qi].options[oi] = value;
    setQuiz({ ...quiz, questions: updated });
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0,
    };
    setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
  };

  const handleSubmit = async () => {
    await axios.put(`http://localhost:4000/api/test/${testId}`, quiz);
    alert('Test updated successfully!');
    navigate('/test-mine')
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div className="p-6 text-black">
      <h2 className="text-2xl font-bold mb-4">Edit Test: {quiz.title}</h2>
      <input
        value={quiz.title}
        onChange={(e) => handleChange('title', e.target.value)}
        className="border p-2 rounded w-full mb-3"
        placeholder="Title"
      />
      <input
        value={quiz.image}
        onChange={(e) => handleChange('image', e.target.value)}
        className="border p-2 rounded w-full mb-3"
        placeholder="Image URL"
      />
      <select
        value={quiz.category}
        onChange={(e) => handleChange('category', e.target.value)}
        className="border p-2 rounded w-full mb-3"
      >
        <option value="">Select category</option>
        {categories.map(cat => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>

      <h3 className="text-xl font-semibold mt-4 mb-2">Questions</h3>
      {quiz.questions.map((q, i) => (
        <div key={i} className="border p-4 rounded mb-4 bg-gray-50">
          <input
            value={q.questionText}
            onChange={(e) => handleQuestionChange(i, 'questionText', e.target.value)}
            placeholder={`Question ${i + 1}`}
            className="border p-2 w-full mb-2 rounded"
          />
          {q.options.map((opt, j) => (
            <input
              key={j}
              value={opt}
              onChange={(e) => handleOptionChange(i, j, e.target.value)}
              placeholder={`Option ${j + 1}`}
              className="border p-2 w-full mb-1 rounded"
            />
          ))}
          <label className="block mt-2">
            Correct Answer Index:
            <input
              type="number"
              min="0"
              max="3"
              value={q.correctAnswerIndex}
              onChange={(e) => handleQuestionChange(i, 'correctAnswerIndex', parseInt(e.target.value))}
              className="border ml-2 p-1 w-16 rounded"
            />
          </label>
        </div>
      ))}

      <button
        onClick={handleAddQuestion}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        + Add New Question
      </button>

      <br />

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditTest;
