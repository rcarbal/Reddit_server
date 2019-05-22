const mongoose = require('mongoose');

let postSchema = new mongoose.Schema({
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: String
    },
    created: Number,
    subreddit_prefix: String,
    url: String,
    title: String,
    hint: String,
    thumbnail: String,
    fallback: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
  });

module.exports = mongoose.model("Post", postSchema);