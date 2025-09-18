const { Router } = require("express");
const { setupAccount, updateProfile } = require("../../controllers/profile.controller");

const router = Router();

router.post("/SetupAccount", setupAccount);
router.post("/UpdateProfile", updateProfile);
// router.post("/Login", login);

module.exports = { profileRouter: router };