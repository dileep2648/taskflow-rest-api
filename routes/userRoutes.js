const express = require('express');
const {registerUserController,loginUserController} = require("../controllers/userController");
const ValidateResgisteration = require("../middleware/validateRegistration");
const ValidateLogin = require("../middleware/validateLogin");
const router = express.Router();

router.post("/",ValidateResgisteration,registerUserController);
router.post("/login",ValidateLogin,loginUserController);
module.exports = router;