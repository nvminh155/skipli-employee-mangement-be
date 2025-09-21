const { doc, getDoc } = require("firebase/firestore");
const { userModel } = require("../models/user.model");
const { createHttpErr } = require("../utils/errorHelper");
const { ERR_MESS } = require("../constants");
const { db } = require("../firebase");

const getConversationById = async (req, res) => {
  const { id } = req.params;

  const ref = doc(db, "conversations", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw createHttpErr(ERR_MESS.DATA_NOT_FOUND.key, "Conversation not found");
  }
  const conversation = snap.data();

  const members = conversation.members;
  const otherMemberId = members.find((member) => member !== req.user.id);
  const otherMember = await userModel.getUserById(otherMemberId);

  if (!otherMember) {
    throw createHttpErr(ERR_MESS.DATA_NOT_FOUND.key, "Other member not found");
  }

  const data = {
    ...conversation,
    otherMember,
  };

  res.status(200).json({
    message: "Conversation found",
    data,
    success: true,
  });
};

module.exports = {
  getConversationById,
};
