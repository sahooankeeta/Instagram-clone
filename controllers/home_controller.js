const Post = require("../models/post");
module.exports.home = function (req, res) {
  Post.find({})
    .sort("-createdAt")
    .populate("user")
    .exec(function (err, posts) {
      return res.render("home", {
        title: "Insta | Home",
        posts: posts,
      });
    });
};
