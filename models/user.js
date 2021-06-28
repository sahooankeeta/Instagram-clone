const mongoose = require("mongoose");
const cypto = require("crypto");
const validator = require("validator");
const brcypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const AVATAR_PATH = path.join("/uploads/users/avatars");
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,

      lowercase: true,
      unique: true,
      default: this.name,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: path.join("/uploads/users/avatars/", "default-user.jpg"),
    },
    bio: {
      type: String,
    },
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", AVATAR_PATH));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
UserSchema.statics.uploadedAvatar = multer({ storage: storage }).single(
  "avatar"
);
UserSchema.statics.avatarPath = AVATAR_PATH;
UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.getRandomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Dtae.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
