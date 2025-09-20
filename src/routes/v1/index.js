const { Router } = require("express");
const router = Router();
const { authRouter } = require("./auth.route");
const { profileRouter } = require("./profile.route");
const { employeeRouter } = require("./employee.route");
const { taskRouter } = require("./task.route");
const authMiddleware = require("../../middlewares/auth.middleware");
const managerMiddleware = require("../../middlewares/manager.middleware");

router.get("/test", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});
router.use("/auth", authRouter);
router.use("/profile", authMiddleware, profileRouter);
router.use("/employees", authMiddleware, managerMiddleware, employeeRouter);
router.use("/tasks",authMiddleware, taskRouter);
module.exports = { routerV1: router };
