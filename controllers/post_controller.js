const Post = require("../models/post");
const Comment = require("../models/comment");
const path = require("path");
const fs = require("fs");
module.exports.create = function (req, res) {
  Post.uploadedAvatar(req, res, function (err) {
    if (err) {
      console.log("err in multer--");
    }
    Post.create(
      {
        image: path.join("/uploads/posts/avatars/" + req.file.filename),
        caption: req.body.caption,
        user: req.user._id,
      },
      function (err, post) {
        if (err) {
          console.log("err in creating post");
          return;
        }
        return res.redirect("back");
      }
    );
  });
};
module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);
    if (post.user == req.user.id) {
      const p = path.join(__dirname, "..", post.image);
      fs.unlink(p, (err) => {
        if (err) {
          console.log("err in removing file");
          return;
        }
      });
      post.remove();
      await Comment.deleteMany({ post: req.params.id });
      return res.redirect("back");
    }
  } catch (err) {
    console.log("err in destroy post,err");
    return;
  }
};
