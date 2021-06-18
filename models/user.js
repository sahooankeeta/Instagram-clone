const mongoose = require("mongoose");
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
// UserSchema.pre("save", function (next) {
//   const saltRounds = 10;
//   // Check if the password has been modified
//   if (this.modifiedPaths().includes("password")) {
//     bcrypt.genSalt(saltRounds, (err, salt) => {
//       if (err) return next(err);
//       bcrypt.hash(this.password, salt, (err, hash) => {
//         if (err) return next(err);
//         this.password = hash;
//         next();
//       });
//     });
//   } else {
//     next();
//   }
// });

// UserSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     try {
//       const document = await User.findOne({
//         $or: [{ email: this.email }, { username: this.username }],
//       });
//       if (document)
//         return next(
//           new RequestError(
//             "A user with that email or username already exists.",
//             400
//           )
//         );
//       await mongoose.model("Followers").create({ user: this._id });
//       await mongoose.model("Following").create({ user: this._id });
//     } catch (err) {
//       return next((err.statusCode = 400));
//     }
//   }
// });

const User = mongoose.model("User", UserSchema);
module.exports = User;
