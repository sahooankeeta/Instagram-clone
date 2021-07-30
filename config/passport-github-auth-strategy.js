var passport = require("passport");
const crypto = require("crypto");
const User = require("../models/user");
const axios = require("axios");

var session = require("express-session");
var GitHubStrategy = require("passport-github2").Strategy;

const GITHUB_CLIENT_ID = "90c60346cce71b5a28a7";
const GITHUB_CLIENT_SECRET = "6709bbf218191255c4a6e57a153a86a1b0a3ccca";
const GITHUB_CALLBACK_URL = "http://localhost:8000/users/auth/github/callback";
//tell passport to use new strategy for github auth login
passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
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
              console.log("error in strategy", err);
              return;
            }
            return done(null, user);
          }
        );
      }
    }
  )
);
