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
      comment = await comment.populate("user").execPopulate();
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment: comment,
          },
          message: "Post created!",
        });
      }

      req.flash("success", "comment added");
      res.redirect("back");
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
      let post = await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });

      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment_id: req.params.id,
          },
          message: "Comment deleted",
        });
      }

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
module.exports.toggleLike = async function (req, res) {
  try {
    let commentId = req.params.id;
    let deleted = false;
    let comment = await Comment.updateOne(
      { _id: commentId, likes: { $ne: req.user.id } },
      {
        $push: { likes: req.user.id },
      }
    );
    if (!comment.nModified) {
      if (!comment.ok) {
        return res
          .status(500)
          .send({ error: "Could not vote on the comment." });
      }
      // Nothing was modified in the previous query meaning that the user has already liked the comment
      // Remove the user's like
      const commentDislikeUpdate = await Comment.updateOne(
        { _id: commentId },
        {
          $pull: { likes: req.user.id },
        }
      );
      deleted = true;
      if (!commentDislikeUpdate.nModified) {
        return res
          .status(500)
          .send({ error: "Could not vote on the comment." });
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
