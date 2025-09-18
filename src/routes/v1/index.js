const { Router } = require("express");
const router = Router();

router.get("/test", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

module.exports = { routerV1: router };
