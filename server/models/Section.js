const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SectionSchema = new Schema({
  sectionName: {
    type: String,
    required: true,
    trim: true
  },
  subSections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubSection",
    required: true
  }]
});

// Compile model from schema
const Section = mongoose.model("Section", SectionSchema);
module.exports = Section;
