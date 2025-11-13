const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [String],
  correctAnswerIndex: Number
})

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'QuizCategory' }, // ✅ updated ref
  image: String,
  questions: [questionSchema]
})

module.exports = mongoose.model('Quiz', quizSchema)
