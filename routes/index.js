const express = require("express");
const router = express.Router();
const homecontroller = require("./../controllers/home_controller");

router.get("/", homecontroller.home);
router.use("/users", require("./users"));
router.use("/posts", require("./posts"));

router.use("/comments", require("./comments"));
// router.use("/likes", require("./likes"));
// router.use("/friends", require("./friends"));
// router.use("/api", require("./api"));
module.exports = router;
