const mongoose = require("mongoose");

const FollowersSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Followers = mongoose.model("Followers", FollowersSchema);
module.exports = Followers;
