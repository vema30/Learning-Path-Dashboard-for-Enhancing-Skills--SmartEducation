const mongoose = require("mongoose");

const testQuestionSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    validate: [arr => arr.length === 4, 'Exactly 4 options required.'],
    required: true,
  },
  correctOption: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
}, { timestamps: true });

module.exports = mongoose.model("TestQuestion", testQuestionSchema);
