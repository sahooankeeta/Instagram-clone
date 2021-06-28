const User = require("../models/user");
const crypto = require("crypto");
const Post = require("../models/post");
const path = require("path");
module.exports.profile = async function (req, res) {
  try {
    let user = await User.findById(req.params.id);
    if (user) {
      let posts = await Post.find({ user: req.params.id });
      return res.render("user-profile", {
        title: "Insta | Profile",
        profile_user: user,
        posts: posts,
      });
    } else {
      return res.redirect("/users/sign-in");
    }
  } catch (err) {
    console.log("err in profile", err);
    return;
  }
};
module.exports.viewUpdate = async function (req, res) {
  try {
    let user = await User.findById(req.params.id);
    if (user) {
      return res.render("update-user", {
        title: "Insta | Profile",
        update_user: user,
      });
      // console.log("user found");
    } else {
      return res.redirect("/back");
    }
  } catch (err) {
    console.log("err in viewupdate", err);
    return;
  }
};

module.exports.update = async function (req, res) {
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log("multer err");
        }
        user.name = req.body.name;
        user.name = req.body.name;
        user.username = req.body.username;
        user.bio = req.body.bio;
        if (req.file) {
          user.avatar = path.join(
            "/uploads/users/avatars/" + req.file.filename
          );
        }
        user.save();
        return res.redirect("/users/profile/" + req.user.id);
      });
    } catch (err) {
      // req.flash("error", err);
      return res.redirect("back");
    }
  } else {
    // req.flash("error", "user coul not be updated");
    return res.status(401).send("unauthorized");
  }
};

//render sign up page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  return res.render("user-sign-up", {
    title: "Insta | Sign Up",
  });
};
//render sign in page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  return res.render("user-sign-in", {
    title: "Insta | Sign In",
  });
};
module.exports.create = function (req, res) {
  //console.log(req.body);
  if (req.body.password != req.body.confirm_password)
    return res.redirect("back");
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log(" sign up err");
      return;
    }
    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) return;
        console.log("user created");
      });
      // new ToggleFriend($(" .toggle-friend-btn"), newPost);
      // req.flash("success", "account created");
      return res.redirect("/users/sign-in");
    } else {
      console.log("user alreay exists");
      return res.redirect("back");
    }
  });
};
module.exports.createSession = function (req, res) {
  req.flash("success", "logged in successfully");
  return res.redirect("/");
  // User.findOne({ email: req.body.email }, function (err, user) {
  //   if (err) {
  //     console.log("error in finding user in signing in");
  //     return;
  //   }
  //   // handle user found
  //   if (user) {
  //     // handle password which doesn't match
  //     if (user.password != req.body.password) {
  //       return res.redirect("back");
  //     }

  //     // handle session creation
  //     res.cookie("user_id", user.id);
  //     return res.redirect("/users/profile");
  //   } else {
  //     // handle user not found

  //     return res.redirect("back");
  //   }
  // });
};
module.exports.destroySession = function (req, res) {
  req.flash("success", "logged out");
  req.logout();

  return res.redirect("/");
};
module.exports.follow = async function (req, res) {
  try {
    let userId = req.params.id;
    let unfollowed = false;
    let user = await User.updateOne(
      { _id: req.user.id, following: { $ne: userId } },
      {
        $push: { following: userId },
      }
    );
    let followuser = await User.updateOne(
      { _id: userId, followers: { $ne: req.user.id } },
      {
        $push: { followers: req.user.id },
      }
    );
    if (!user.nModified) {
      if (!user.ok) {
        return res.status(500).send({ error: "Could not follow user" });
      }
      // Nothing was modified in the previous query meaning that the user has already liked the post
      // Remove the user's like
      const userunfollowUpdate = await User.updateOne(
        { _id: req.user.id },
        {
          $pull: { following: userId },
        }
      );
      const unfollowuser = await User.updateOne(
        { _id: userId },
        {
          $pull: { followers: req.user.id },
        }
      );
      unfollowed = true;
      if (!userunfollowUpdate.nModified) {
        return res.status(500).send({ error: "Could not follow user." });
      }
    }
    return res.status(200).json({
      message: "request succesful",
      data: {
        unfollowed: unfollowed,
      },
    });
  } catch (err) {
    console.log("err in like", err);
    return;
  }
};
module.exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(404, {
        message: "no user with this email found",
      });
    const resetToken = User.createPasswordResetToken();
    await User.save({ validateBeforeSve: false });
  } catch (err) {}
};
module.exports.resetPassword = async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) return next();
};
