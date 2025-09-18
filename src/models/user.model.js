const {
  doc,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
  collection,
} = require("firebase/firestore");
const { db } = require("../firebase");
const { config } = require("../config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userModel = {
  async createUser({ phoneNumber, fullName, email, password, role, uuid }) {
    try {
      const userRef = doc(db, "users", uuid);
      const user = {
        phoneNumber,
        fullName,
        email,
        password,
        role,
        id: uuid,
      };
      await setDoc(userRef, user);
    } catch (error) {
      throw error;
    }
  },
  async getUserByEmail(email) {
    const userRef = collection(db, "users");
    const q = query(userRef, where("email", "==", email));
    const snap = await getDocs(q);
    if (snap.empty) {
      return null;
    }

    const docSnap = snap.docs[0];
    const data = docSnap.data();

    const retUser = {
      ...(data ?? {}),
      snapId: docSnap.id,
    };
    return retUser;
  },
  generateJwtToken: (payload) => {
    const curDate = new Date();
    const curMinutes = curDate.getMinutes();
    curDate.setMinutes(curMinutes + 60);

    return jwt.sign(payload, config.JWT_KEY, {
      expiresIn: "1h",
    });
  },
  hashPassword: async (password) => {
    return await bcrypt.hash(password, 8);
  },
  verifyPassword: async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  },
};

module.exports = { userModel };
