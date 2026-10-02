const {getTasks,getTaskById,createTask,updateTask,patchTask,deleteTask} = require("../services/taskService");



const getTasksController = (req, res) => {
    const tasks = getTasks(req.query);
    res.json({
        tasks:tasks,
        message: "Controller is working!"
    });
};

const getTaskByIDController = (req,res)=>{
    const task = getTaskById(Number(req.params.id));
    res.json({
        task:task
    })
}


const createTaskController = (req, res) => {
    const newTask = createTask(req.body);

    return res.status(201).json({
        task: newTask
    });
};

const updateTaskController =(req,res)=>{
     const ID = Number(req.params.id);
    const uTask = updateTask(ID,req.body);
    return res.status(200).json({
        task:uTask
    });
}

const patchTaskController =(req,res)=>{
    const ID = Number(req.params.id);
    const pTask = patchTask(ID,req.body);
    return res.status(200).json({
        task:pTask
    });
}

const deleteTaskController =(req,res)=>{
    const ID = Number(req.params.id);
    const dTask = deleteTask(ID);
    return res.status(200).json({
        task:dTask
    });
}

module.exports = {
    getTasksController,
    getTaskByIDController,
    createTaskController,
    updateTaskController,
    patchTaskController,
    deleteTaskController
};