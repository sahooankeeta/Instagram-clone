const express = require("express");
const passport = require("passport");
const router = express.Router();
const notificationController = require("./../controllers/notification_controller");
router.post("/requestFollow/:id", notificationController.followRequest);
router.post("/destroy/:id", notificationController.deleteRequest);
module.exports = router;
