const {getTasks,getTaskById,createTask,updateTask,patchTask,deleteTask} = require("../services/taskService");



const getTasksController = async (req,res,next)=>{
    try{
        const tasks = await getTasks(req.query,req.user.sub);
        return res.status(200).json({
            tasks:tasks
        });
    } catch (error){
        next(error);
    }
};

const getTaskByIDController = async (req,res,next)=>{
    try{
    const task = await getTaskById(Number(req.params.id), req.user.sub);
     res.json({
        task:task
    }); }

    catch(error){
        next(error);
    }
   
}


const createTaskController = async (req, res, next) => {
    try{
    const newTask = await  createTask(req.body,req.user.sub);
    return res.status(201).json({
        task: newTask
    });}
    catch(error){
        next(error);
    }
};

const updateTaskController =async (req,res,next)=>{
    const ID = Number(req.params.id);
    try{
    const uTask = await updateTask(ID,req.body,req.user.sub);
    return res.status(200).json({
        task:uTask
    });}
    catch (error)
    {
        next(error);
    }
}

const patchTaskController =async (req,res,next)=>{
    const ID = Number(req.params.id);
    try{
        const pTask = await patchTask(ID,req.body,req.user.sub);
        return res.status(200).json({
            task:pTask
        });
    } catch (error) {
        next(error);
    }
}

const deleteTaskController =async (req,res,next)=>{
    const ID = Number(req.params.id);
    try{
        const dTask = await deleteTask(ID,req.user.sub);
        return res.status(200).json({
            task:dTask
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getTasksController,
    getTaskByIDController,
    createTaskController,
    updateTaskController,
    patchTaskController,
    deleteTaskController
};