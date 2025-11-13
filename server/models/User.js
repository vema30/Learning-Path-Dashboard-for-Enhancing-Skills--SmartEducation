const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
       firstName: {
           type: String,
           required: true,
           trim: true
       },
       lastName: {
           type: String,
           required: true,
           trim: true
       },
       email: {
           type: String,
           required: true,
           trim: true
       },
       password: {
           type: String,
           required: true
       },
       accountType: {
           type: String,
           required: true,
           enum: ['Admin', 'User', 'Instructor', 'Student']
       },
       // Corrected Field Name
       additionalDetails: {
        required:true,
           type: mongoose.Schema.Types.ObjectId,
           ref: "Profile"
       },
       courses: [{
           type: mongoose.Schema.Types.ObjectId,
           ref: "Course"
       }],
       completedLectures: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubSection",    unique: true,

  }
]
,
       image: {
           type: String
       },
       token: {
           type: String
       },
       resetPasswordExpires: {
           type: Date
       },
       courseProgress: [{
           type: mongoose.Schema.Types.ObjectId,
           ref: "CourseProgress"
       }],
       takenTests: [
        {
          quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz"
          },
          score: {
            type: Number
          },
          total: {
            type: Number
          },
          answers: [Number],
          date: {
            type: Date,
            default: Date.now
          }
        }
      ]
   });
   

   const User = mongoose.model("User", userSchema);
   module.exports = User;
   