const moment = require("moment");
const Message = require("./../models/message");
const { userJoin, userLeave, getCurrentUser } = require("./chat_user");
module.exports.chatSockets = function (socketServer) {
  let io = require("socket.io")(socketServer);
  io.sockets.on("connection", function (socket) {
    // console.log("new user received", socket.id);

    socket.on("disconnect", function () {
      // console.log("disconnected");
      const user = userLeave(socket.id);
      io.emit("leave_room", user);
    });
    socket.on("user_left", function (data) {
      data.time = moment().format("h:mm a");
      data.message = `${data.username} has left`;
      io.in(data.chatroom).emit("user_leftmsg", data);
    });
    socket.on("join_room", function (data) {
      // console.log("joining req received", data);
      socket.join(data.chatroom);
      userJoin(socket.id, data.username, data.chatroom);
      data.time = moment().format("h:mm a");
      data.message = `${data.username} has joined`;
      io.in(data.chatroom).emit("user_joined", data);
    });
    socket.on("send_message", async function (data) {
      data.time = moment().format("h:mm a");
      await Message.create({
        user: data.username,
        message: data.message,
        time: data.time,
      });
      io.in(data.chatroom).emit("receive_message", data);
    });
  });
};
