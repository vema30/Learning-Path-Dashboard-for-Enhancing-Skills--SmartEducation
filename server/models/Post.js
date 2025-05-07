// const mongoose = require('mongoose');
// const postSchema = new mongoose.Schema({
//   title: String,
//   content: String,
//   image: String,
//    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
// }, { timestamps: true });
// module.exports = mongoose.model('Post', postSchema);



const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  likes: {
    type: [String],  // Change this to [String] to store timestamp-based likes
    default: []
  },
  image:String
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
