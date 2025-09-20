const jwt = require("jsonwebtoken");
const { db } = require("../firebase");
const { doc, getDoc } = require("firebase/firestore");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error("Unauthorized");

    const token = authHeader.split(" ")[1];
    if (!token) throw new Error("Unauthorized");

    const data = jwt.verify(token, process.env.JWT_SECRET);
    if (!data || Date.now() >= data.exp * 1000) {
      throw new Error("Unauthorized");
    }

    const userRef = doc(db, "users", data.id);
    const user = await getDoc(userRef);
    req.user = user.data();


    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized", success: false });
  }
};
