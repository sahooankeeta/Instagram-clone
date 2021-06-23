const express = require("express");
const router = express.Router();
const passport = require("passport");
const userscontroller = require("./../controllers/users_controller");

router.get(
  "/profile/:id",
  passport.checkAuthentication,
  userscontroller.profile
);
router.get("/sign-up", userscontroller.signUp);
router.get("/sign-in", userscontroller.signIn);
router.get("/sign-out", userscontroller.destroySession);
router.get("/update-settings/:id", userscontroller.viewUpdate);
router.post(
  "/update/:id",
  passport.checkAuthentication,
  userscontroller.update
);
router.post("/follow/:id", userscontroller.follow);
router.post("/create", userscontroller.create);
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/sign-in" }),
  userscontroller.createSession
);
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
  userscontroller.createSession
);
module.exports = router;
