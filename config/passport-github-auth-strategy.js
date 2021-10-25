var passport = require("passport");
const dotenv = require("dotenv");
const crypto = require("crypto");
const User = require("../models/user");
const axios = require("axios");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "./../config.env") });
var session = require("express-session");
var GitHubStrategy = require("passport-github2").Strategy;

const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK;
//tell passport to use new strategy for github auth login
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      const githubUser = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `token ${accessToken}` },
      });

      const emails = await axios.get("https://api.github.com/user/emails", {
        headers: { Authorization: `token ${accessToken}` },
      });

      const primaryEmail = emails.data.find((email) => email.primary).email;
      const existingUser = await User.findOne({
        $or: [{ email: primaryEmail }, { username: githubUser.data.login }],
      });
      if (existingUser) {
        return done(null, existingUser);
      } else {
        User.create(
          {
            name: githubUser.data.name,
            username: githubUser.data.login,
            email: primaryEmail,
            password: crypto.randomBytes(20).toString("hex"),
          },
          function (err, user) {
            if (err) {
              //console.log("error in strategy", err);
              return;
            }
            return done(null, user);
          }
        );
      }
    }
  )
);
