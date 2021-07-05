const Post = require("../models/post");
const User = require("../models/user");
const Message = require("../models/message");
// const Likes = require("../models/like");
module.exports.home = async function (req, res) {
  try {
    let posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      });
    let messages = await Message.find({}).sort("-createdAt");
    let users = await User.find({ _id: { $ne: req.user.id } });
    return res.render("home", {
      title: "Insta | Home",
      posts: posts,
      messages: messages,
      all_users: users,
    });
  } catch (err) {
    console.log("Error in home controller", err);
    return;
  }
};
