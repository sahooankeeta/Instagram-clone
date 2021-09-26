const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notificationMsg: {
      type: String,
    },
    notificationType: {
      type: String,
    },
    notificationInfo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const notificationModel = mongoose.model("notification", NotificationSchema);
module.exports = notificationModel;
