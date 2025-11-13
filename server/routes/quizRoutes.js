const express = require('express')
const router = express.Router()
const Quiz = require('../models/Quiz')

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('category')
    res.json(quizzes)
  } catch (err) {
    res.status(500).json({ message: 'Server Error' })
  }
})

// Get a specific quiz
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('category')
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' })
    res.json(quiz)
  } catch (err) {
    res.status(500).json({ message: 'Server Error' })
  }
})

// Create a new quiz
router.post('/', async (req, res) => {
  try {
    const quiz = new Quiz(req.body)
    await quiz.save()
    res.status(201).json({ message: 'Quiz created successfully', quiz })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
