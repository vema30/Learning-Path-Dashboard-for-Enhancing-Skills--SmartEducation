const express = require('express')
const router = express.Router()
const QuizCategory = require('../models/QuizCategory')

// Get all categories

router.get('/categories1', async (req, res) => {
  console.log("GET /categories hit");
  try {
    const categories = await QuizCategory.find({});
    console.log("Found categories:", categories);
    return res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});


// Create a category
router.post('/categories', async (req, res) => {
  try {
    console.log("create category",req.body);
    const category = new QuizCategory({ name: req.body.name })
    await category.save()
    res.status(201).json(category)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
