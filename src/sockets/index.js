const { conversationModel } = require("../models/conversation.model");
const chatChannel = require("./chat.channel");

module.exports = function (io) {

  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    socket.on("disconnect", (socket) => {
      console.log("a user disconnected", socket.id);
    });
  });

  io.of("/chat").on("connection", async (socket) => {
    const userId = socket.handshake.auth.userId;

    // tìm các list chat hiện có
    const rooms = await conversationModel.getConversations(userId);
    rooms.forEach((room) => {
      socket.join(room.id);
    });

    // console.log("yours rooms = ", rooms)
    socket.emit("rooms", rooms);
    chatChannel(socket, io.of("/chat"));
  });
};
