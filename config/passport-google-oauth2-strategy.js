const passport = require("passport");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");
const nodeMailer = require("../config/nodemailer");

//tell passport to use new strategy for google auth login
passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
    },
    function (accessToken, refreshToken, profile, done) {
      //find user
      User.findOne({ email: profile.emails[0].value }).exec(function (
        err,
        user
      ) {
        if (err) {
          // console.log("eoor is strategr");
          return;
        }

        if (user) {
          return done(null, user);
        } else {
          //if user not found,create user and set it as logged in user
          User.create(
            {
              name: profile.displayName,
              username: profile.displayName.replace(/ /g, ""),
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString("hex"),
            },
            function (err, user) {
              if (err) {
                //console.log("error in strategy", err);
                return;
              }
              //if new user created send confirmation mail
              nodeMailer.transporter.sendMail(
                {
                  from: "noreply@hello.com",
                  to: user.email,
                  subject: "Welcome To Instagram-Clone",
                  html: "<h1>enjoy your experiance :)</h1>",
                },
                (err, info) => {
                  if (err) {
                    //console.log("err in sending mail", err);
                    return;
                  }

                  return;
                }
              );
              return done(null, user);
            }
          );
        }
      });
    }
  )
);

module.exports = passport;
