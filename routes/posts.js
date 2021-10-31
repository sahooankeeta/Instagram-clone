const express = require("express");
const passport = require("passport");
const router = express.Router();
const upload = require("./../utils/multer");
const postController = require("./../controllers/post_controller");
router.post(
  "/create",
  passport.checkAuthentication,
  upload.array("image"),
  postController.create
);
router.get(
  "/destroy/:id",
  passport.checkAuthentication,
  postController.destroy
);
router.post("/toggle/:id", postController.toggleLike);
router.get("/view/:id", postController.view);
module.exports = router;
// passport.checkAuthentication,
