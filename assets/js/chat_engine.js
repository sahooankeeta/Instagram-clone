class ChatEngine {
  constructor(chatBoxId, username) {
    this.chatBox = $(`#${chatBoxId}`);
    this.username = username;
    let connectionOptions = {
      "force new connection": true,
      reconnectionAttempts: "Infinity",
      timeout: 10000,
      transports: ["websocket"],
    };
    this.socket = io.connect("http://localhost:5000", connectionOptions);
    if (this.username) {
      this.connectionHandler();
    }
  }
  connectionHandler() {
    let self = this;
    this.socket.on("connect", function () {
      // console.log("chat connection done");

      self.socket.emit("join_room", {
        username: self.username,
        chatroom: "instaclone",
      });
      self.socket.on("leave_room", function (data) {
        self.socket.emit("user_left", {
          username: data.username,
          chatroom: "instaclone",
        });
      });
      self.socket.on("user_leftmsg", function (data) {
        //  console.log("a user has joined", data);
        const msg = `<div class="system message">
        <div class="message-name">${data.username}</div>
        <div class="message-body">
          <span class="chat-message">${data.message}</span>
          <span class="chat-time"> ${data.time}</span>
        </div>
      </div>`;
        const chatRoom = document.querySelector(".chat-room");

        $(".chat-room").append(msg);
        chatRoom.scrollTop = chatRoom.scrollHeight;
      });
      self.socket.on("user_joined", function (data) {
        //  console.log("a user has joined", data);
        const msg = `<div class="system message">
        <div class="message-name">${data.username}</div>
        <div class="message-body">
          <span class="chat-message">${data.message}</span>
          <span class="chat-time"> ${data.time}</span>
        </div>
      </div>`;
        const chatRoom = document.querySelector(".chat-room");

        $(".chat-room").append(msg);
        chatRoom.scrollTop = chatRoom.scrollHeight;
      });
    });

    document
      .querySelector(".chat-form")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        let msg = e.target.elements.chat_input.value;
        //console.log(msg);
        self.socket.emit("send_message", {
          message: msg,
          username: self.username,

          chatroom: "instaclone",
        });
        e.target.elements.chat_input.value = "";
        e.target.elements.chat_input.focus();
      });
    self.socket.on("receive_message", function (data) {
      //console.log("message received", data.message);
      let type = "receiver";
      if (data.username == self.username) type = "sender";
      const msg = `<div class="${type} message">
      <div class="message-name">${data.username}</div>
      <div class="message-body">
        <span class="chat-message">${data.message}</span>
        <span class="chat-time"> ${data.time}</span>
      </div>
    </div>`;
      const chatRoom = document.querySelector(".chat-room");

      $(".chat-room").append(msg);
      chatRoom.scrollTop = chatRoom.scrollHeight;
    });
  }
}
