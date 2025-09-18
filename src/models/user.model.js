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
        password: await hashPassword(password),
        role,
        id: uuid,
      };
      console.log(user);
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
      throw new Error("User not found");
    }

    const docSnap = snap.docs[0];
    const data = docSnap.data();

    const retUser = {
      ...(data ?? {}),
      snapId: docSnap.id,
    };
    return {
      ...retUser,
      access_token: generateJwtToken(retUser),
    };
  },
};

// async function getUserById(id) {
//   console.log(await hashPassword("phoneNumber"))
//   console.log(await userModel.getUserByEmail("minhnv155@gmail.com"))
// }
// getUserById()
async function hashPassword(password) {
  return await bcrypt.hash(password, 8);
}

async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

function generateJwtToken(payload) {
  const curDate = new Date();
  const curMinutes = curDate.getMinutes();
  curDate.setMinutes(curMinutes + 60);

  return jwt.sign(payload, config.JWT_KEY, {
    expiresIn: "1h",
  });
}

async function verifyToken(token) {
  return await jwt.verify(token, process.env.JWT_KEY);
}

module.exports = { userModel };
