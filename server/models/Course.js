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
  sections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    default: []
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
  tag: {
    type: [String],
    required: true
  },
  Category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }],
  studentsEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  courseProgress: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseProgress",
    }
  ],
    progressPercentage:{
    type:Number,
    default:0
  }
}, {
  timestamps: true  // ✅ This adds createdAt and updatedAt
});

// Compile model from schema
const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
