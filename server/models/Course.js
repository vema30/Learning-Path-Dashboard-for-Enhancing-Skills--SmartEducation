const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  courseDescription: {
    type: String,
    required: true,
    trim: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  whatYouWillLearn: {
    type: String,
    required: true,
    trim: true
  },
  courseContent: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section"
  }],
  ratingAndReview: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "RatingAndReview"
  }],
  price: {
    type: Number
  },
  thumbnail: {
    type: String
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag"
  }],
  studentsEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
});

// Compile model from schema
const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
