const { Router } = require("express");
const { createEmployee, getEmployeeById, updateEmployee, deleteEmployee, getEmployees} = require("../../controllers/employee.controller");

const router = Router();

router.post("/createEmployee", createEmployee);
router.get("/:id", getEmployeeById);
router.post("/", getEmployees);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

module.exports = { employeeRouter: router };