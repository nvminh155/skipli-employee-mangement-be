const { conversationModel } = require("../models/conversation.model");

module.exports = async function (socket, io) {
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
  });
  socket.on("sendMessage", ({ conversationId, ...data }) => {
    conversationModel.createMessage({
      ...data,
      conversationId,
    });
    io.to(conversationId).emit("sendMessage", data);
  });
};
