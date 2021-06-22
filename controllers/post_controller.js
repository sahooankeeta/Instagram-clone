const Post = require("../models/post");
const Comment = require("../models/comment");

// const Like = require("../models/like");
const path = require("path");
const fs = require("fs");
module.exports.create = function (req, res) {
  Post.uploadedAvatar(req, res, async function (err) {
    if (err) {
      console.log("err in multer--");
    }
    try {
      let post = await Post.create({
        image: path.join("/uploads/posts/avatars/" + req.file.filename),
        caption: req.body.caption,
        user: req.user._id,
      });

      req.flash("success", "post added");
      res.redirect("/");
    } catch (err) {
      console.log("err in creating post", err);
      return;
    }
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
      // await Like.deleteMany({ likeable: post, onModel: "Post" });
      // await Like.deleteMany({ _id: { $in: post.comments } });

      post.remove();
      await Comment.deleteMany({ post: req.params.id });
      req.flash("success", "post deleted");
      return res.redirect("back");
    }
  } catch (err) {
    console.log("err in destroy post", err);
    return;
  }
};
module.exports.toggleLike = async function (req, res) {
  try {
    let postId = req.params.id;
    let deleted = false;
    let post = await Post.updateOne(
      { _id: postId, likes: { $ne: req.user.id } },
      {
        $push: { likes: req.user.id },
      }
    );
    if (!post.nModified) {
      if (!post.ok) {
        return res.status(500).send({ error: "Could not vote on the post." });
      }
      // Nothing was modified in the previous query meaning that the user has already liked the post
      // Remove the user's like
      const postDislikeUpdate = await Post.updateOne(
        { _id: postId },
        {
          $pull: { likes: req.user.id },
        }
      );
      deleted = true;
      if (!postDislikeUpdate.nModified) {
        return res.status(500).send({ error: "Could not vote on the post." });
      }
    }
    return res.status(200).json({
      message: "request succesful",
      data: {
        deleted: deleted,
      },
    });
  } catch (err) {
    console.log("err in like", err);
    return;
  }
};
