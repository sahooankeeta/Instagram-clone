const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    user: {
      type: String,
    },
    time: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
