const express = require("express");
const router = express.Router();
const validateTask = require("../middleware/validateTask");
const patchValidator = require("../middleware/patchValidator");
const queryValidator = require("../middleware/queryValidator");
const {getTasksController,getTaskByIDController,createTaskController,updateTaskController,patchTaskController,deleteTaskController} = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");
const validateTaskId = require("../middleware/validateTaskId");


router.get("/", authMiddleware, queryValidator, getTasksController);
router.get("/:id", authMiddleware, validateTaskId, getTaskByIDController);
router.post("/", authMiddleware, validateTask, createTaskController);
router.put("/:id", authMiddleware, validateTaskId, validateTask, updateTaskController);
router.patch("/:id", authMiddleware, validateTaskId, patchValidator, patchTaskController);
router.delete("/:id", authMiddleware, validateTaskId, deleteTaskController);


module.exports = router;