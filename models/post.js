const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const AVATAR_PATH = path.join("/uploads/posts/avatars");
const PostSchema = new mongoose.Schema(
  {
    image: [{ type: String }],

    caption: String,

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  }
);
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", AVATAR_PATH));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + file.originalname);
  },
});
PostSchema.statics.uploadedAvatar = multer({ storage: storage }).array("image");
PostSchema.statics.avatarPath = AVATAR_PATH;
const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
