const { Router } = require("express");
const { createNewAccessCode, validateAccessCode} = require("../../controllers/auth.controller");

const router = Router();

router.post("/CreateNewAccessCode", createNewAccessCode);

router.post("/ValidateAccessCode", validateAccessCode);

// router.post("/Login", login);

module.exports = { authRouter: router };