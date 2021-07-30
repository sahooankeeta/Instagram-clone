const mongoose = require("mongoose");

const FollowRequestsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  followRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const FollowRequest = mongoose.model("FollowRequest", FollowRequestsSchema);
module.exports = FollowRequest;
