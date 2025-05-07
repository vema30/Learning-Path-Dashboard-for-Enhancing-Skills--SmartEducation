const mongoose = require("mongoose")
const commentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    text: { type: String },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, required: true },  // Ensure userName is saved in the schema
  });
  
  module.exports = mongoose.model('Comment', commentSchema);
  