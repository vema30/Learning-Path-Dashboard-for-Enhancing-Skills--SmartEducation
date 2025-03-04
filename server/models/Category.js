const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
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
  courses: [{ // Changed from single ObjectId to an array initial i used onlt object but i need array of object to store multiple courses
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }]
}, { timestamps: true }); // Adds createdAt and updatedAt

// Compile model from schema
const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
