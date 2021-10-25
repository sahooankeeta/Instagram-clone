const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./../models/user");
//authentication

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    async function (req, email, password, done) {
      //find user and establish identity
      await User.findOne(
        {
          email: email,
        },
        async function (err, user) {
          if (err) {
            return done(err);
          }
          //check password
          let passwordCheck = await user.correctPassword(
            password,
            user.password
          );
          //if user not found or password not matched
          if (!user || !passwordCheck) {
            req.flash("error", "INVALID USERNAME / PASSWORD");
            return done(null, false);
          }

          return done(null, user);
        }
      );
    }
  )
);
//serializing
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      // console.log("Err in finding user");
      return done(err);
    }
    return done(null, user);
  });
});
//check user is authenticated
passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.redirect("/users/sign-in");
};
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};
module.exports = passport;
