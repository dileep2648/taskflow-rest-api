const express = require('express');
const {registerUserController,loginUserController} = require("../controllers/userController");
const ValidateResgisteration = require("../middleware/validateRegistration");
const router = express.Router();

router.post("/",ValidateResgisteration,registerUserController);
router.post("/login",loginUserController);
module.exports = router;