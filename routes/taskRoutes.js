const express = require("express");
const router = express.Router();
const validateTask = require("../middlewear/validateTask");
const patchValidator = require("../middlewear/patchValidator");
const queryValidator = require("../middlewear/queryValidator");
const {getTasksController,getTaskByIDController,createTaskController,updateTaskController,patchTaskController,deleteTaskController} = require("../controllers/taskController");


router.get("/", queryValidator, getTasksController);
router.get("/:id",getTaskByIDController);
router.post("/", validateTask, createTaskController);
router.put("/:id",validateTask,updateTaskController);
router.patch("/:id",patchValidator,patchTaskController);
router.delete("/:id",deleteTaskController);


router.get("/", (req, res) => {
    console.log(req.query);
    let FTasks = [...tasks];

    return res.status(200).json({
        tasks: FTasks
    });
});

module.exports = router;