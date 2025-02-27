const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingAndReviewSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    trim: true, // Keeps formatting clean
    required: false // Allows ratings without a text review
  }
}, { timestamps: true }); // Adds createdAt and updatedAt

const RatingAndReview = mongoose.model("RatingAndReview", ratingAndReviewSchema);
module.exports = RatingAndReview;
