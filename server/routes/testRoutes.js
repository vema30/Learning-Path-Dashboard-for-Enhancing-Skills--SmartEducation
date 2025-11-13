const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Quiz = require('../models/Quiz')

// Submit a test
router.post('/submit', async (req, res) => {
  try {
    const { userId, quizId, answers } = req.body
    console.log("hey i am in submit route and printting body",req.body);
    const quiz = await Quiz.findById(quizId)
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' })

    let score = 0
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswerIndex) score++
    })
  console.log("score",score);
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    user.takenTests.push({
      quizId,
      answers,
      score,
      total: quiz.questions.length,
      date: new Date()
    })

    await user.save()
    res.json({ message: 'Test submitted successfully', score, total: quiz.questions.length })
  } catch (err) {
    res.status(500).json({ message: 'Server Error' })
  }
})

// Get test results for a user
router.get('/user/:userId/results', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('takenTests.quizId')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user.takenTests)
  } catch (err) {
    res.status(500).json({ message: 'Server Error' })
  }
})

module.exports = router
