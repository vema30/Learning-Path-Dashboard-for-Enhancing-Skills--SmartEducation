const express = require('express')
const router = express.Router()
const QuizCategory = require('../models/QuizCategory')

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await QuizCategory.find()
    res.json(categories)
  } catch (err) {
    res.status(500).json({ message: 'Server Error' })
  }
})

// Create a category
router.post('/', async (req, res) => {
  try {
    const category = new QuizCategory({ name: req.body.name })
    await category.save()
    res.status(201).json(category)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
