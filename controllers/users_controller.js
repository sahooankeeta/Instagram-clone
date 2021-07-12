const User = require("../models/user");
const crypto = require("crypto");
const nodeMailer = require("../config/nodemailer");
const Post = require("../models/post");
const Comment = require("../models/comment");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

//render profile page
module.exports.profile = async function (req, res) {
  try {
    let user = await User.findById(req.params.id);
    if (user) {
      let posts = await Post.find({ user: req.params.id });
      let users = await User.find({ _id: { $ne: req.user.id } });
      return res.render("user-profile", {
        title: "Insta | Profile",
        profile_user: user,
        posts: posts,
        all_users: users,
      });
    } else {
      return res.redirect("/users/sign-out");
    }
  } catch (err) {
    console.log("error in user profile", err);
    return;
  }
};
//render user profile update form
module.exports.viewUpdate = async function (req, res) {
  try {
    let user = await User.findById(req.params.id);
    let users = await User.find({ _id: { $ne: req.user.id } });
    if (user) {
      return res.render("update-user", {
        title: "Insta | Profile",
        update_user: user,
        all_users: users,
      });
    } else {
      return res.redirect("/users/profile/" + req.params.id);
    }
  } catch (err) {
    console.log("err in viewupdate", err);
    return;
  }
};
//update user profile
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
        user.username = req.body.username.replace(/ /g, "");
        user.bio = req.body.bio;
        if (req.file) {
          user.avatar = path.join(
            "/uploads/users/avatars/" + req.file.filename
          );
        }
        user.save();
        req.flash("success", "Profile updated successfully");
        return res.redirect("/users/profile/" + req.user.id);
      });
    } catch (err) {
      req.flash("error", "Sorry could not update profile");
      return res.redirect("/users/profile/" + req.user.id);
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
//deactivate user account
module.exports.destroy = async function (req, res) {
  try {
    let user = await User.findById(req.user.id);
    if (user.avatar.indexOf("default") == -1) {
      const p = path.join(__dirname, "..", user.avatar);
      fs.unlink(p, (err) => {
        if (err) {
          console.log("err in removing user profile");
          return;
        }
      });
    }
    user.following.forEach(async (el) => {
      await User.updateOne(
        { _id: el },
        {
          $pull: { followers: req.user.id },
        }
      );
    });
    user.followers.forEach(async (el) => {
      await User.updateOne(
        { _id: el },
        {
          $pull: { following: req.user.id },
        }
      );
    });
    await Post.find({ user: req.user.id }, (err, posts) => {
      if (err) return;
      posts.map((post) => {
        const postimage = path.join(__dirname, "..", post.image);
        fs.unlink(postimage, (err) => {
          if (err) {
            console.log("err in removing post image");
            return;
          }
        });
      });
    });

    user.remove();

    await Post.deleteMany({ user: req.user.id });
    await Comment.deleteMany({ user: req.user.id });

    req.flash("success", "your account has been deactivated");
    return res.redirect("/");
  } catch (err) {
    console.log("err in destroy user", err);
    return;
  }
};
//render password reset form with token
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
//create new user
module.exports.create = function (req, res) {
  if (req.body.password != req.body.passwordConfirm)
    return res.redirect("back");
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log(" sign up err");
      return;
    }
    if (!user) {
      User.create(
        {
          name: req.body.name,
          username: req.body.username.replace(/ /g, ""),
          email: req.body.email,
          password: req.body.password,
        },
        function (err, user) {
          if (err) return;
          console.log("user created");
        }
      );
      //send mail confirming user account
      nodeMailer.transporter.sendMail(
        {
          from: "noreply@hello.com",
          to: req.body.email,
          subject: "Welcome TO Instagram-Clone",
          html: "<h1>enjoy your experiance</h1>",
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

      return res.redirect("/users/sign-in");
    } else {
      req.flash("error", "user with this email alreay exists");

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
//follow or unfollow a user
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
//send mail for password reset action
module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  await User.findOne({ email }, (err, user) => {
    if (err || !user) {
      req.flash("error", "user with this email not found");
      return res.redirect("/");
    }
    //create token that expires in 20 minutes
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
          req.flash("could not send email,try again");
          console.log("err in sending mail", err);
          return;
        }
        req.flash("success", "email sent for reset password");
        return;
      }
    );
    return user.updateOne({ resetLink: token }, (err, success) => {
      if (err) {
        req.flash("error", "reset link error");
        return res.redirect("/");
      }
      req.flash("success", "password reset mail sent");
      return res.redirect("/");
    });
  });
};
//reset user password
module.exports.resetPassword = async (req, res) => {
  const { resetLink, new_password, new_confirm_password } = req.body;
  if (resetLink) {
    jwt.verify(
      resetLink,
      process.env.RESET_PASSWORD_KEY,
      async (err, decode) => {
        if (err) {
          req.flash("error", "incorrect or expired token");
          return res.redirect("/");
        }
        await User.findOne({ resetLink }, async (err, user) => {
          if (err || !user) {
            req.flash("error", "authentication error try again");
            return res.redirect("/");
          }
          if (new_password == new_confirm_password) {
            user.password = new_password;
            user.resetLink = "";
            await user.save();
            req.flash("success", "password changed");
            return res.redirect("/users/sign-in");
          } else {
            req.flash("error", "error in changing password");
            return res.redirect("/users/sign-in");
          }
        });
      }
    );
  } else {
    req.flash("error", "authentication error,try again");
    return res.redirect("/");
  }
};
