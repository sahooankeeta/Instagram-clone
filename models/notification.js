const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    senderName: {
      type: String,
    },
    senderAvatar: {
      type: String,
    },
    senderId: {
      type: String,
    },
    receiverId: {
      type: String,
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
