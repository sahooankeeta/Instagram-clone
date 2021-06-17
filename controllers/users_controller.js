const User = require("../models/user");
const Post = require("../models/post");
module.exports.profile = function (req, res) {
  console.log(req.cookies.user_id);
  // if (req.cookies.user_id) {
  //   console.log("cookie present");
  //   User.findById(req.cookies.user_id, function (err, user) {
  //     if (user) {
  //       console.log("user found");
  //       return res.render("user-profile", {
  //         title: "Insta | Profile",
  //         user: user,
  //       });
  //     } else {
  //       return res.redirect("/users/sign-in");
  //     }
  //   });
  // } else {
  //   return res.redirect("/users/sign-in");
  // }
  User.findById(req.user.id, function (err, user) {
    if (user) {
      console.log("user found");
      return res.render("user-profile", {
        title: "Insta | Profile",
        user: user,
      });
    } else {
      return res.redirect("/users/sign-in");
    }
  });
};
//render sign up page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user-sign-up", {
    title: "Insta | Sign Up",
  });
};
//render sign in page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
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
  req.logout();
  // req.flash("success", "logged out ");
  return res.redirect("/");
};
