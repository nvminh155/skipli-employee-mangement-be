const { Router } = require("express");
const { getConversationById } = require("../../controllers/conversation.controller");

const router = Router();

router.get("/:id", getConversationById);

module.exports = { conversationRouter: router };