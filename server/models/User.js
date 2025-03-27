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
       }]
   });
   

   const User = mongoose.model("User", userSchema);
   module.exports = User;
   