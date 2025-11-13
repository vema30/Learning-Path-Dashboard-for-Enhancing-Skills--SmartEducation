const mongoose = require('mongoose')

const quizCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
})

module.exports = mongoose.model('QuizCategory', quizCategorySchema)
