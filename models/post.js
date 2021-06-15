const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  image: String,

  caption: String,

  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const postModel = mongoose.model("Post", PostSchema);
module.exports = postModel;
