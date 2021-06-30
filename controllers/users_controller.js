const User = require("../models/user");
const crypto = require("crypto");
const nodeMailer = require("../config/nodemailer");
const Post = require("../models/post");
const path = require("path");
const jwt = require("jsonwebtoken");

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
module.exports.passwordresetform = function (req, res) {
  return res.render("password-reset", {
    title: "Insta | password reset",
    token: req.params.token,
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
  if (req.body.password != req.body.passwordConfirm)
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
module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  await User.findOne({ email }, (err, user) => {
    if (err || !user)
      return res.status(400).json({
        error: "user with this email not found",
      });
    const token = jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY, {
      expiresIn: "20m",
    });
    nodeMailer.transporter.sendMail(
      {
        from: "noreply@hello.com",
        to: user.email,
        subject: "Welcome TO Instagram-Clone",
        html: `<p>password reset link</p><a href="http://localhost:8000/users/resetpasswordform/${token}">click here</a>`,
      },
      (err, info) => {
        if (err) {
          console.log("err in sending mail", err);
          return;
        }
        console.log("email sent", info);
        return;
      }
    );
    return user.updateOne({ resetLink: token }, (err, success) => {
      if (err)
        return res.status(400).json({
          error: "reset link error",
        });
      req.flash("success", "password reset mail sent");
      return res.redirect("/");
    });
  });

  // try {
  //   const user = await User.findOne({ email: req.body.email });
  //   if (!user)
  //     return res.status(404).json({
  //       message: "no user with this email found",
  //     });
  //   const resetToken = User.createPasswordResetToken();
  //   await User.save({ validateBeforeSve: false });
  // } catch (err) {
  //   console.log("err in forgot", err);
  //   return;
  // }
};
module.exports.resetPassword = async (req, res) => {
  const { resetLink, new_password, new_confirm_password } = req.body;
  if (resetLink) {
    jwt.verify(
      resetLink,
      process.env.RESET_PASSWORD_KEY,
      async (err, decode) => {
        if (err) {
          return res.status(401).json({
            error: "incorrect or expired token",
          });
        }
        await User.findOne({ resetLink }, async (err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: "user with this token not found",
            });
          }
          if (new_password == new_confirm_password) {
            user.password = new_password;
            user.resetLink = "";
            await user.save();
            req.flash("sucess", "password changed");
            return res.redirect("/users/sign-in");
          } else {
            req.flash("error", "err in password changed");
            return res.redirect("/users/sign-in");
          }
        });
      }
    );
  } else {
    return res.status(401).json({
      error: "reset auth error",
    });
  }

  // const hashedToken = crypto
  //   .createHash("sha256")
  //   .update(req.params.token)
  //   .digest("hex");
  // const user = await User.findOne({
  //   passwordResetToken: hashedToken,
  //   passwordResetExpires: { $gt: Date.now() },
  // });
  // if (!user) {
  //   console.log("token invalid or expired");
  //   next();
  // }
  // if (req.body.password == req.body.confirm_password) {
  //   user.password = req.body.password;
  //   user.passwordResetExpires = undefined;
  //   user.passwordResetToken = undefined;
  //   await user.save();
  //   req.flash("sucess", "password changed");
  //   return res.redirect("/users/sign-in");
  // } else {
  //   req.flash("error", "err in password changed");
  //   return res.redirect("/users/sign-in");
  // }
};
