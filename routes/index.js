const express = require("express");
const passport = require("passport");
const router = express.Router();

const homecontroller = require("./../controllers/home_controller");

router.get("/", passport.checkAuthentication, homecontroller.home);
router.use("/users", require("./users"));
router.use("/posts", require("./posts"));
router.use("/notifications", require("./notifications"));
router.use("/comments", require("./comments"));

module.exports = router;
