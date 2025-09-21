const { conversationModel } = require("../models/conversation.model");
const { userModel } = require("../models/user.model");

module.exports = async function (socket, io) {
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
  });
  socket.on("sendMessage", async ({ conversationId, ...data }) => {
    conversationModel.createMessage({
      ...data,
      conversationId,
    });
    const from = data.from;
    const formObj = await userModel.getUserById(from);
    io.to(conversationId).emit("receiveMessage", {
      ...data,
      createdAt: Date.now(),
      from: formObj,
    });
  });

  socket.on("getMessages", async (conversationId) => {
    const messages = await conversationModel.getMessages(conversationId);
    socket.emit("messages", messages);
  });
};
