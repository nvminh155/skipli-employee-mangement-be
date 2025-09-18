const { Router } = require("express");
const router = Router();
const { authRouter } = require("./auth.route");
const { profileRouter } = require("./profile.route");

router.get("/test", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});
router.use("/auth", authRouter);
router.use("/profile", profileRouter);
module.exports = { routerV1: router };
