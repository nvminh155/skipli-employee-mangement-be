const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error("Unauthorized");

    const token = authHeader.split(" ")[1];
    if (!token) throw new Error("Unauthorized");

    const data = jwt.verify(token, process.env.JWT_SECRET)
    
    const user = await userModel.getUser(data.id);
    req.user = decoded;
    
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized", success: false });
  }
}