const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [String],
  correctAnswerIndex: Number,
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'QuizCategory' },
  image: String,
  questions: [questionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ✅ added field
}, {
  timestamps: true, // optional: adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Quiz', quizSchema);
