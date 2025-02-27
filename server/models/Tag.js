const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TagSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: { 
    type: String,
    required: true,
    trim: true
  },
  courses: [{ // Changed from single ObjectId to an array
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }]
}, { timestamps: true }); // Adds createdAt and updatedAt

// Compile model from schema
const Tag = mongoose.model("Tag", TagSchema);
module.exports = Tag;
