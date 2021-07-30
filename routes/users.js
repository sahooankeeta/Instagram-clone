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
router.get("/destroy", userscontroller.destroy);
router.get("/remove-profile-image", userscontroller.removeProfileImage);
router.get("/update-settings/:id", userscontroller.viewUpdate);
router.get("/resetpasswordform/:token", userscontroller.passwordresetform);
router.post(
  "/update/:id",
  passport.checkAuthentication,
  userscontroller.update
);
router.post("/follow", userscontroller.follow);
router.post("/forgotPassword", userscontroller.forgotPassword);
router.post("/resetPassword", userscontroller.resetPassword);
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
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user :email"] })
);
router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/users/sign-in" }),
  userscontroller.createSession
);
module.exports = router;
