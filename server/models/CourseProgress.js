const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseProgressSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  completedVideos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubSection",
    default: []
  }]
});

// Compile model from schema
const CourseProgress = mongoose.model("CourseProgress", CourseProgressSchema);
module.exports = CourseProgress;
