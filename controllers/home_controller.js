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
    let f = await User.findById(req.user.id);
    let suggestedUsers;
    if (f.following.length == 0) suggestedUsers = users;
    else
      suggestedUsers = await User.find({
        $and: [{ _id: { $ne: f.following } }, { _id: { $ne: req.user.id } }],
      }).limit(5);
    return res.render("home", {
      title: "Insta | Home",
      posts: posts,
      messages: messages,
      all_users: users,
      suggested: suggestedUsers,
    });
  } catch (err) {
    console.log("Error in home controller", err);
    return;
  }
};
