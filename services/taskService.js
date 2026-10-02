const AppError = require("../utils/AppError");

const tasks = [
    {
        id: 1,
        title: "Learn Node.js",
        completed: false
    },
    {
        id: 2,
        title: "Learn Express",
        completed: true
    },
    {
        id: 3,
        title: "Build REST API",
        completed: false
    },
    {
        id: 4,
        title: "Practice JavaScript",
        completed: true
    },
    {
        id: 5,
        title: "Learn PostgreSQL",
        completed: false
    },
    {
        id: 6,
        title: "Build TaskFlow",
        completed: true
    },
    {
        id: 7,
        title: "Practice DSA",
        completed: false
    },
    {
        id: 8,
        title: "Learn Git and GitHub",
        completed: true
    },
    {
        id: 9,
        title: "Build Authentication",
        completed: false
    },
    {
        id: 10,
        title: "Learn Docker",
        completed: true
    }
];

const getTasks = (query) => {
    let FTasks = [...tasks];
    if (query.completed !== undefined) {
        const cmp = query.completed.toLowerCase() === "true";
        FTasks =FTasks.filter(task => task.completed === cmp);
    }

    if (query.search !== undefined) {
        const searchTerm = query.search.toLowerCase();
        FTasks = FTasks.filter(task => task.title.toLowerCase().includes(searchTerm));
    }

    if (query.sort !== undefined) {
        if (query.order === "asc") {
            FTasks.sort((a, b) => a.title.localeCompare(b.title));
        }
        else if(query.order === "desc") {
            FTasks.sort((a, b) => b.title.localeCompare(a.title));
        }
    }

    if (query.page !== undefined && query.limit !== undefined) {
        const page = Number(query.page);
        const limit = Number(query.limit);
        const start = (page-1)*limit;
        const end = start+limit;
        FTasks=FTasks.slice(start,end);
}
    return FTasks;
}

const getTaskById = (id)=>{
    const task = tasks.find(task=>task.id===id);
        if(!task){
            throw new AppError("No task found with that ID",404);
        }

        return task;
   
}

const createTask = (taskData)=>{
    const newID = tasks.length + 1;
    const ntask = {
        id: newID,
        title: taskData.title,
        completed: taskData.completed
    }
    tasks.push(ntask);

    return ntask;
}

const updateTask =(id,taskData)=>{
    const uTask = tasks.find(task => task.id === id);
     if (!uTask) {
        throw new AppError("Task not found", 404);
    }
    uTask.title=taskData.title;
    uTask.completed=taskData.completed;
    return uTask;
}

const patchTask =(id,taskData)=>{
    const pTask = tasks.find(task => task.id === id);
    if (!pTask) {
    throw new AppError("Task not found", 404);
}
    if(taskData.title!==undefined){
        pTask.title=taskData.title;
    }
    if(taskData.completed!==undefined){
        pTask.completed=taskData.completed;
    }
    return pTask;
}

const deleteTask =(id)=>{
    const dTask = tasks.find(task => task.id === id);

if (!dTask) {
    throw new AppError("Task not found", 404);
}
    const ID = tasks.findIndex(task=>task.id===id);
    tasks.splice(ID,1);
    return dTask;
}

module.exports = {
    getTasks,getTaskById,createTask,updateTask,patchTask,deleteTask
};