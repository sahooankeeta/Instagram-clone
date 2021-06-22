// const Like = require("../models/like");
const Comment = require("./../models/comment");
const Post = require("./../models/post");
module.exports.create = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post);
    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });
      post.comments.push(comment);
      post.save();

      req.flash("success", "comment added");
      res.redirect("/");
    }
  } catch (err) {
    console.log("err in create comment", err);
    return;
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);
    if (comment.user == req.user.id) {
      let postId = comment.post;
      comment.remove();
      let post = Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });
      await Like.deleteMany({ likeable: comment, onModel: "Comment" });

      req.flash("success", "comment removed");
      return res.redirect("back");
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    console.log("err in destroy comment", err);
    return;
  }
};
