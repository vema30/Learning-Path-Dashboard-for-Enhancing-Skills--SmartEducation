const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  gender: {
    type: String,
    //enum: ["Male", "Female", "Other", "Prefer not to say"],
  },
  dateOfBirth: {
    type: String, // Changed from String to Date
  },
  about: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: String,
    trim: true,
    match: [/^\d{10,15}$/, "Please enter a valid contact number"], // Ensures 10-15 digit phone numbers
  }
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// Compile model from schema
const Profile = mongoose.model("Profile", ProfileSchema);
module.exports = Profile;
