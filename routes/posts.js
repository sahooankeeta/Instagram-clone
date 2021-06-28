const express = require("express");
const passport = require("passport");
const router = express.Router();

const postController = require("./../controllers/post_controller");
router.post("/create", passport.checkAuthentication, postController.create);
router.get(
  "/destroy/:id",
  passport.checkAuthentication,
  postController.destroy
);
router.post("/toggle/:id", postController.toggleLike);
router.get("/view/:id", postController.view);
module.exports = router;
// passport.checkAuthentication,
