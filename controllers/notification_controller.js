const Notification = require("../models/notification");
const User = require("../models/user");
const FollowRequest = require("../models/follow-requests");
module.exports.followRequest = async function (req, res) {
  try {
    const userId = req.params.id;
    const user = req.user.id;
    let unrequested = false;
    const userToFollow = await User.findById(userId);
    const reqUser = await User.findById(user);
    if (!userToFollow) {
      return res
        .status(400)
        .send({ error: "Could not find a user with that id." });
    }

    const addFollowRequest = await FollowRequest.updateOne(
      { user: user, followRequests: { $ne: userId } },
      { $push: { followRequests: userId } }
    );

    if (!addFollowRequest.nModified) {
      if (!addFollowRequest.ok) {
        return res
          .status(500)
          .send({ error: "Could not follow user please try again later." });
      }
      // Nothing was modified in the above query meaning that the user is already already sent request
      // delete request instead
      unrequested = true;

      const removeFollowRequest = await FollowRequest.updateOne(
        { user: user },
        { $pull: { followRequests: userId } }
      );
      if (!removeFollowRequest.ok) {
        return res
          .status(500)
          .send({ error: "Could not follow user please try again later." });
      }
    }
    if (!unrequested) {
      await Notification.create(
        {
          sender: req.user.id,
          receiver: req.params.id,
          notificationMsg: "has requested to follow you",
          notificationType: "followRequest",
        },
        (err, not) => {
          if (err) {
            //console.log("err in send noti");
            return res.redirect("/");
          }
        }
      );
    } else {
      await Notification.findOneAndDelete(
        { sender: req.user.id },
        { receiver: req.params.id }
      );
    }
    return res.status(200).json({
      message: "request succesful",
      data: {
        unrequested: unrequested,
      },
    });
  } catch (err) {
    return res.redirect("/");
  }
};
module.exports.deleteRequest = async function (req, res) {
  try {
    let deleted = true;
    const notification = await Notification.findById(req.params.id);
    await Notification.deleteOne({ _id: req.params.id }, (err, deleted) => {
      if (err) {
        return res.redirect("back");
      }
    });
    const removeFollowRequest = await FollowRequest.updateOne(
      { user: notification.sender },
      { $pull: { followRequests: req.user.id } }
    );

    return res.status(200).json({
      message: "request succesful",
      data: {
        deleted: deleted,
      },
    });
  } catch (err) {
    return res.redirect("back");
  }
};
