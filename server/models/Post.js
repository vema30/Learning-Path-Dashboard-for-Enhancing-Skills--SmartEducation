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
    type: [String], // or [mongoose.Schema.Types.ObjectId] if you're storing actual User IDs
    default: []
  }
,      image:String
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
