const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ProfileSchema = new Schema(
  {
    gender: {
      type: String,
      required: false,
    },
    dateOfBirth: {
      type: Date,
      required: false,
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Date of birth cannot be in the future",
      },
    },
    about: {
      type: String,
      trim: true,
      required: false,
    },
    contactNumber: {
      type: String,
      trim: true,
      match: [/^\+?\d{10,15}$/, "Contact number must be 10 to 15 digits, optionally starting with '+'"],
      required: false,
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", ProfileSchema);
module.exports = Profile;
