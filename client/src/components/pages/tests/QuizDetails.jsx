import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

const QuizDetails = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Access the user data from the Redux state
  const { user, isLoading, error: userError } = useSelector((state) => state.profile);

  // Handle when the user is not authenticated or user data is not loaded
  useEffect(() => {
    if (!user || userError) {
      navigate('/login'); // Redirect if user is not authenticated or there is an error with the user data
      return;
    }

    axios.get(`http://localhost:4000/api/quizzes/${id}`)
      .then(res => {
        setQuiz(res.data);
        setAnswers(new Array(res.data.questions.length).fill(null));
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load quiz data. Please try again later.');
        setLoading(false);
      });
  }, [id, user, userError, navigate]);

  const handleOptionChange = (qIndex, value) => {
    const updated = [...answers];
    updated[qIndex] = value;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    if (!user) {
      alert('Please log in to submit the quiz.');
      return;
    }

    axios.post('http://localhost:4000/api/tests/submit', {
      userId: user._id, // Assuming the user object has _id
      quizId: id,
      answers,
    })
      .then(res => {
        navigate('/test-result', { state: res.data });
      })
      .catch(err => {
        alert('Error submitting quiz. Please try again.');
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>
      {quiz.questions.map((q, i) => (
        <div key={i} className="mb-4">
          <p className="font-semibold">{i + 1}. {q.questionText}</p>
          {q.options.map((opt, j) => (
            <div key={j}>
              <input
                type="radio"
                name={`q${i}`}
                value={j}
                checked={answers[i] === j}
                onChange={() => handleOptionChange(i, j)}
              />
              <label className="ml-2">{opt}</label>
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit} className="mt-4 px-6 py-2 bg-green-600 text-white rounded">
        Submit Test
      </button>
    </div>
  );
};

export default QuizDetails;
