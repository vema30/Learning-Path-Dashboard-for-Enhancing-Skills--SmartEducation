import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const QuizDetails = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(10); // Timer in seconds (20 minutes)
  const [isTimeUp, setIsTimeUp] = useState(false);
  const navigate = useNavigate();

  const { user, error: userError } = useSelector((state) => state.profile);

  useEffect(() => {
    if (!user || userError) {
      navigate('/login');
      return;
    }

    axios.get(`http://localhost:4000/api/test/${id}`)
      .then(res => {
        setQuiz(res.data);
        setAnswers(new Array(res.data.questions.length).fill(null));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load quiz data. Please try again later.');
        setLoading(false);
      });

    const interval = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          setIsTimeUp(true); // Automatically submit when the timer runs out
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [id, user, userError, navigate]);

  const handleOptionChange = (qIndex, value) => {
    const updated = [...answers];
    updated[qIndex] = value;
    setAnswers(updated);
  };
 if(isTimeUp){
  axios.post('http://localhost:4000/api/test/submit', {
    userId: user._id,
    quizId: id,
    answers,
  })
    .then(res => {
      navigate('/test-result', { state: res.data });
    })
    .catch(() => {
      alert('Error submitting quiz. Please try again.');
    });
};

 
  const handleSubmit = () => {
    if (!user) {
      alert('Please log in to submit the quiz.');
      return;
    }

    axios.post('http://localhost:4000/api/test/submit', {
      userId: user._id,
      quizId: id,
      answers,
    })
      .then(res => {
        navigate('/test-result', { state: res.data });
      })
      .catch(() => {
        alert('Error submitting quiz. Please try again.');
      });
  };

  if (loading) return <div className="text-center text-xl mt-10">Loading quiz...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded shadow-sm mt-8 text-black">
      <h2 className="text-4xl font-bold text-center text-blue-700 mb-10">{quiz.title}</h2>

      <div className="text-center mb-6">
        <p className="text-xl font-semibold text-red-500">
          Time Left: {formatTime(timer)}
        </p>
      </div>

      {isTimeUp ? (
        <div className="text-center text-xl font-bold text-red-600">
          Time's up! Submitting your answers now...
        </div>
      ) : (
        quiz.questions.map((q, i) => (
          <div key={i} className="mb-6 p-5 bg-white rounded-lg shadow">
            <p className="font-semibold text-xl mb-4 text-gray-800">
              {i + 1}. {q.questionText}
            </p>

            {q.options.map((opt, j) => (
              <div
                key={j}
                className={`flex items-center p-3 mb-2 border rounded cursor-pointer transition duration-150 ${
                  answers[i] === j ? 'bg-blue-100 border-blue-400' : 'hover:bg-blue-50'
                }`}
                onClick={() => handleOptionChange(i, j)}
              >
                <input
                  type="radio"
                  name={`q${i}`}
                  value={j}
                  checked={answers[i] === j}
                  onChange={() => handleOptionChange(i, j)}
                  className="mr-3 accent-blue-600"
                />
                <label className="cursor-pointer text-gray-700">{opt}</label>
              </div>
            ))}
          </div>
        ))
      )}

      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={isTimeUp}
          className={`px-8 py-3 ${isTimeUp ? 'bg-caribbeangreen-400' : 'bg-caribbeangreen-600 hover:bg-green-700'} text-white font-semibold rounded-lg transition duration-300`}
        >
          {isTimeUp ? 'Test Submitted' : 'Submit Test'}
        </button>
      </div>
    </div>
  );
};

export default QuizDetails;
