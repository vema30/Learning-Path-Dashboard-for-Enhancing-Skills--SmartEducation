const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema(
  {
    gender: {
      type: String,
     // enum: ["Male", "Female", "Other", "Prefer not to say"],
      required: false,
    },
    dateOfBirth: {
      type: Date, // Use Date type for consistent date handling
      required: false,
    },
    about: {
      type: String,
      trim: true,
      required: false,
    },
    contactNumber: {
      type: String,
      trim: true,
      match: [/^\+?\d{10,15}$/, "Please enter a valid contact number"], // Support for optional "+" for country codes
      required: false,
    },
  },
  { timestamps: true } // createdAt and updatedAt timestamps
);

// Compile model from schema
const Profile = mongoose.model("Profile", ProfileSchema);
module.exports = Profile;
