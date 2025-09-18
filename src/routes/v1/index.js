const { Router } = require("express");
const router = Router();
const { authRouter } = require("./auth.route");

router.get("/test", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});
router.use("/auth", authRouter);

module.exports = { routerV1: router };
