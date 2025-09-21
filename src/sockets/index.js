const { conversationModel } = require("../models/conversation.model");
const chatChannel = require("./chat.channel");

module.exports = function (io) {

  io.on("connection", (socket) => {
    socket.on("disconnect", (socket) => {
    });
  });

  io.of("/chat").on("connection", async (socket) => {
    const userId = socket.handshake.auth.userId;

    // tìm các list chat hiện có
    const rooms = await conversationModel.getConversations(userId);
    rooms.forEach((room) => {
      socket.join(room.id);
    });

    socket.emit("rooms", rooms);
    chatChannel(socket, io.of("/chat"));
  });
};
