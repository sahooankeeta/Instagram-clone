const express = require("express");
const router = express.Router();
const passport = require("passport");
const userscontroller = require("./../controllers/users_controller");
router.get("/profile", passport.checkAuthentication, userscontroller.profile);
router.get("/sign-up", userscontroller.signUp);
router.get("/sign-in", userscontroller.signIn);
router.post("/create", userscontroller.create);
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/sign-in" }),
  userscontroller.createSession
);
module.exports = router;
//passport.authenticate("local", { failureRedirect: "/users/sign-in" })
