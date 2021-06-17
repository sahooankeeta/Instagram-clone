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
module.exports.destroy = function (req, res) {
  Post.findById(req.params.id, function (err, post) {
    if (post.user == req.user.id) {
      const p = path.join(__dirname, "..", post.image);
      fs.unlink(p, (err) => {
        if (err) {
          console.log("err in removing file");
          return;
        }
      });
      post.remove();
      Comment.deleteMany({ post: req.params.id }, function (err) {
        return res.redirect("back");
      });
    } else {
      return res.redirect("back");
    }
  });
};
