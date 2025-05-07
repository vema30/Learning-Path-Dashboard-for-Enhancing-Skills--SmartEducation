const TestQuestion = require("../models/TestQuestion");
const Course = require("../models/Course");

exports.createTestQuestion = async (req, res) => {
  try {
    const { courseId, question, options, correctOption } = req.body;

    // Validation
    if (!courseId || !question || !options || correctOption === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({
        success: false,
        message: "Exactly 4 options are required",
      });
    }

    if (correctOption < 0 || correctOption > 3) {
      return res.status(400).json({
        success: false,
        message: "Correct option must be between 0 and 3",
      });
    }

    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const newQuestion = await TestQuestion.create({
      courseId,
      question,
      options,
      correctOption,
    });

    return res.status(200).json({
      success: true,
      message: "Test question created successfully",
      data: newQuestion,
    });

  } catch (error) {
    console.error("Error creating test question:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
