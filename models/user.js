const mongoose = require("mongoose");
const Followers = require("./followers");
const Following = require("./following");
const FollowRequest = require("./follow-requests");
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
      minlength: 6,
      required: true,
    },
    accountType: {
      type: String,
      default: "private",
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
UserSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const document = await User.findOne({
        $or: [{ email: this.email }, { username: this.username }],
      });
      if (document)
        return next(
          new RequestError(
            "A user with that email or username already exists.",
            400
          )
        );
      await Followers.create({ user: this._id });
      await Following.create({ user: this._id });
      await FollowRequest.create({ user: this._id });
    } catch (err) {
      return next((err.statusCode = 400));
    }
  }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
