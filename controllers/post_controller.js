const Post = require("../models/post");
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
