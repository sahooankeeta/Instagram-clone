const Post = require("../models/post");
const User = require("../models/user");
module.exports.home = function (req, res) {
  Post.find({})
    .sort("-createdAt")
    .populate("user")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    })
    .exec(function (err, posts) {
      User.find({ _id: { $ne: req.user.id } }, function (err, users) {
        return res.render("home", {
          title: "Insta | Home",
          posts: posts,
          all_users: users,
        });
      });
    });
};
