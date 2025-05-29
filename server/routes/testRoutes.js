const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Quiz = require('../models/Quiz')

// Submit a test
// GET /api/test/instructor/:instructorId

// GET /api/test/taken?userId=...
router.get("/taken", async (req, res) => {
  try {
    const { userId } = req.query; // ✅ this is correct for GET with query params

    if (!userId) {
      return res.status(400).json({ error: "userId query parameter is required" });
    }

    const user = await User.findById(userId)
      .populate("takenTests.quizId")
      .select("takenTests");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ takenTests: user.takenTests });
  } catch (err) {
    console.error("Error fetching taken tests:", err);
    res.status(500).json({ error: "Failed to fetch taken tests" });
  }
});
// DELETE /api/test/taken/:userId/:quizId
router.delete("/taken/:userId/:quizId", async (req, res) => {
  try {
    const { userId, quizId } = req.params;

    // Find user and remove quiz from takenTests array
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { takenTests: { quizId: quizId } } }, // Remove quizId from takenTests array
      { new: true }
    );

    res.status(200).json(updatedUser.takenTests); // Return updated tests
  } catch (err) {
    console.error("Error deleting test:", err);
    res.status(500).json({ error: "Failed to delete test" });
  }
});


router.get('/instructor/:instructorId', async (req, res) => {
  try {
    const { instructorId } = req.params;
    console.log("Fetching tests for instructor:", instructorId);

    const tests = await Quiz.find({ createdBy: instructorId }).populate('category');
    console.log("Found tests:", tests);

    res.status(200).json(tests);
  } catch (err) {
    console.error("Error fetching instructor tests:", err);
    res.status(500).json({ error: 'Failed to fetch instructor tests' });
  }
});
router.delete('/:testId', async (req, res) => {
  try {
    const { testId } = req.params;
    const deletedTest = await Quiz.findByIdAndDelete(testId);

    if (!deletedTest) {
      return res.status(404).json({ error: 'Test not found' });
    }

    res.status(200).json({ message: 'Test deleted successfully' });
  } catch (err) {
    console.error('Error deleting test:', err);
    res.status(500).json({ error: 'Failed to delete test' });
  }
});

router.put('/:testId', async (req, res) => {
  try {
    const { testId } = req.params;
    const { title, category, image, questions } = req.body;

    // Find the quiz by testId and update it
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      testId,
      {
        title,
        category,
        image,
        questions,
      },
      { new: true }  // This option returns the updated document
    );

    if (!updatedQuiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.status(200).json(updatedQuiz);
  } catch (err) {
    console.error("Error updating quiz:", err);
    res.status(500).json({ error: 'Failed to update quiz' });
  }
});


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
