const Post = require("../models/post");
const User = require("../models/user");
const Following = require("../models/following");
const Followers = require("../models/followers");
const FollowRequest = require("../models/follow-requests");
const Message = require("../models/message");
const Notification = require("../models/notification");

module.exports.home = async function (req, res) {
  try {
    //list of users of the logged in user follows
    let f = await Following.find({ user: req.user.id });
    f = f[0].following;
    //public account users
    let public = await User.find(
      { accountType: "public" },
      (err, publicUser) => publicUser._id
    );
    //feed will contains posts of public account users and those the user follows sorted according to time of creation
    let posts = await Post.find({
      $or: [
        { user: { $in: f } },
        { user: { $in: public } },
        { user: req.user._id },
      ],
    })
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      });
    //gathering messages for chatcord
    let messages = await Message.find({}).sort("-createdAt");
    let users = await User.find({ _id: { $ne: req.user.id } });
    //gathering notification
    let nots = await Notification.find({ receiverId: req.user.id }).sort(
      "-createdAt"
    );
    //gathering follow requests
    let requests = await FollowRequest.find({ user: req.user.id });
    requests = requests[0].followRequests;
    //gathering atmax 4 users to suggest
    let suggestedUsers;
    if (requests.length == 0 && f.length == 0) {
      suggestedUsers = await User.find({
        $and: [{ _id: { $ne: res.locals.user.id } }],
      }).limit(4);
    } else if (requests.length == 0) {
      suggestedUsers = await User.find({
        $and: [{ _id: { $ne: f } }, { _id: { $ne: res.locals.user.id } }],
      }).limit(4);
    } else {
      suggestedUsers = await User.find({
        $and: [
          { _id: { $ne: requests } },
          { _id: { $ne: res.locals.user.id } },
        ],
      }).limit(4);
    }
    //rendering the home page
    return res.render("home", {
      title: "Insta | Home",
      posts: posts,
      messages: messages,
      all_users: users,
      suggested: suggestedUsers,
      notifications: nots,
      followers: f,
      requests: requests,
    });
  } catch (err) {
    console.log("Error in home controller", err);
    return;
  }
};
