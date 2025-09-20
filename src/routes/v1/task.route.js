const { Router } = require("express");
const { createTask, getTasks, getTaskById, updateTask, deleteTask} = require("../../controllers/task.controller");

const router = Router();

router.post("/create", createTask);

router.post("/", getTasks);

router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = { taskRouter: router };