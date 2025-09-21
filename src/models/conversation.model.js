const {
  where,
  or,
  getDocs,
  setDoc,
  doc,
  query,
  updateDoc,
  collection,
  orderBy,
} = require("firebase/firestore");
const { db } = require("../firebase");
const { v4: uuidv4 } = require("uuid");
const { userModel } = require("./user.model");

const conversationModel = {
  createMessage: async (message) => {
    const id = uuidv4();
    const messageRef = doc(
      db,
      "conversations",
      message.conversationId,
      "messages",
      id
    );
    await setDoc(messageRef, {
      ...message,
      conversationId: message.conversationId,
      createdAt: Date.now(),
    });

    const conversationRef = doc(db, "conversations", message.conversationId);
    await setDoc(conversationRef, {
      id: message.conversationId,
      members: [message.from, message.to].sort(),
      lastMessage: message.message,
      updatedAt: new Date(),
    });
  },
  getConversations: async (userId) => {
    const q = query(
      collection(db, "conversations"),
      where("members", "array-contains", userId)
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      return [];
    }

    const promise = snap.docs.map(async (doc) => {
      const data = doc.data();
      const members = data.members;

      const otherMemberId = members.find((member) => member !== userId);
      const otherMemberData = await userModel.getUserById(otherMemberId);

      return {
        ...data,
        otherMember: otherMemberData,
      };
    });
    const conversations = await Promise.all(promise);

    return conversations;
  },
  getMessages: async (conversationId) => {
    const q = query(
      collection(db, "conversations", conversationId, "messages"),
      orderBy("createdAt", "asc")
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      return [];
    }

    const promise = snap.docs.map(async (doc) => {
      const data = doc.data();
      const fromMemberId = data.from;
      const fromMemberData = await userModel.getUserById(fromMemberId);

      const toMemberId = data.to;
      const toMemberData = await userModel.getUserById(toMemberId);

      return {
        ...data,
        from: fromMemberData,
        to: toMemberData,
      };
    });
    const messages = await Promise.all(promise);
    return messages;
  },
};

module.exports = {
  conversationModel,
};
