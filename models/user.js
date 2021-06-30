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
      required: [true, "please tell us your name"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "please provide valid email"],
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
    resetLink: {
      type: String,
      default: "",
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
// UserSchema.methods.createPasswordResetToken = function () {
//   const resetToken = crypto.getRandomBytes(32).toString("hex");
//   this.passwordResetToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");
//   console.log({ resetToken }, this.passwordResetToken);
//   this.passwordResetExpires = Dtae.now() + 10 * 60 * 1000;
//   return resetToken;
// };
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await brcypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
UserSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
UserSchema.methods.correctPassword = async function (
  candidatePasswrd,
  userPassword
) {
  return await brcypt.compare(candidatePasswrd, userPassword);
};
const User = mongoose.model("User", UserSchema);
module.exports = User;
