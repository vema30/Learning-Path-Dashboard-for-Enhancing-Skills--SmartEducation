import { useState } from "react";
import axios from "axios";

const CreateTest = () => {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswer: "" }
  ]);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === "options") newQuestions[index].options = value;
    else newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { questionText: "", options: ["", "", "", ""], correctAnswer: "" }]);
  };

  const handleSubmit = async () => {
    const instructorId = "662ffddc123456abcdef1234"; // Replace with logged-in instructor ID
    const courseId = "662ffeee56789abcdef5678"; // Replace with selected course ID

    await axios.post("https://learning-path-dashboard-for-enhancing-7n8z.onrender.com/api/tests", {
      title,
      duration,
      questions,
      createdBy: instructorId,
      course: courseId
    });
    alert("Test Created!");
  };

  return (
    <div>
      <h2>Create Test</h2>
      <input placeholder="Test Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration (min)" />

      {questions.map((q, idx) => (
        <div key={idx}>
          <textarea
            placeholder="Question Text"
            value={q.questionText}
            onChange={e => handleQuestionChange(idx, "questionText", e.target.value)}
          />
          {q.options.map((opt, i) => (
            <input
              key={i}
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={e => {
                const newOpts = [...q.options];
                newOpts[i] = e.target.value;
                handleQuestionChange(idx, "options", newOpts);
              }}
            />
          ))}
          <input
            placeholder="Correct Answer"
            value={q.correctAnswer}
            onChange={e => handleQuestionChange(idx, "correctAnswer", e.target.value)}
          />
        </div>
      ))}

      <button onClick={addQuestion}>Add Another Question</button>
      <button onClick={handleSubmit}>Submit Test</button>
    </div>
  );
};

export default CreateTest;
