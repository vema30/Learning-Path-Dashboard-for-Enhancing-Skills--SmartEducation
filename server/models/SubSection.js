const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubSectionSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  timeDuration: {
    type: String, 
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  videoUrl: {
    type: String,
    required: true,
    trim: true
  }
});

// Compile model from schema
const SubSection = mongoose.model("SubSection", SubSectionSchema);
module.exports = SubSection;
