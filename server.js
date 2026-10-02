const express = require('express');
const app = express();
app.use(express.json());

const tasks = [
    {
        id: 1,
        title: "Learn Node.js",
        completed: false
    },
    {
        id: 2,
        title: "Learn Express",
        completed: false
    }
];

// GET requestsss....
app.get("/", (req, res) => {
    res.send("Welcome to TaskFlow API");
});
app.get("/about", (req, res) => {
    res.send("TaskFlow is a task management API");
});
app.get("/api/tasks", (req, res) => {
    console.log(req.query);
    let FTasks = [...tasks];
    if (req.query.completed !== undefined) {
        const cmp = req.query.completed.toLowerCase() === "true";
        FTasks = FTasks.filter(task => task.completed === cmp);
        console.log(cmp);
        console.log(FTasks);
    }

    if (req.query.search !== undefined) {
        const searchTerm = req.query.search.toLowerCase();
        FTasks = FTasks.filter(task => task.title.toLowerCase().includes(searchTerm));
    }

    if (req.query.sort !== undefined) {
        if (req.query.order === "asc") {
            FTasks.sort((a, b) => a.title.localeCompare(b.title));
        }
        else if(req.query.order === "desc") {
            FTasks.sort((a, b) => b.title.localeCompare(a.title));
        }
    }

    if (req.query.page !== undefined && req.query.limit !== undefined) {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const start = (page-1)*limit;
        const end = start+limit;
        FTasks=FTasks.slice(start,end);
}

    return res.status(200).json({
        tasks: FTasks
    });
});
app.get("/api/tasks/:id", (req, res) => {
    console.log(req.params);
    const id = Number(req.params.id);
    const task = tasks.find(task => {
        return task.id === id;
    });

    if (!task) {
        return res.status(404).json({
            message: "Task Not Found!"
        });
    }

    res.json(task);
})

//POST requestssss.....

app.post("/api/tasks", (req, res) => {
    console.log(req.body);
    if (!req.body.title) {
        return res.status(400).json({
            message: "Title is mandatory:]]"
        })
    }

    if (typeof req.body.title !== "string") {
        return res.status(400).json({
            message: "title type must be a string"
        })
    }

    if (req.body.title.trim() === "") {
        return res.status(400).json({
            message: "the title must not be empty string"
        })
    }
    const newID = tasks.length + 1;
    const ntask = {
        id: newID,
        title: req.body.title,
        completed: req.body.completed
    }
    tasks.push(ntask);

    return res.status(201).json(ntask);

});

//PUT requestss......
app.put("/api/tasks/:id", (req, res) => {
    const ID = Number(req.params.id);
    const task = tasks.find(task => task.id === ID);
    if (!task) {
        return res.status(404).json({
            message: "Task Not Found!"
        });
    }
    task.title = req.body.title;
    task.completed = req.body.completed;

    return res.status(200).json({
        message: "succesfully updated"
    })
});

//PATCH requestss......
app.patch("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find(task => task.id === id);
    if (!task) return res.status(404).json({
        message: "no task exists with that id"
    });

    if (req.body.title !== undefined) {
        task.title = req.body.title;
    }

    if (req.body.completed !== undefined) {
        task.completed = req.body.completed;
    }

    res.status(200).json({
        message: "task updated successfully",
        task: task
    })
});


//DELETE requestss........
app.delete("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) return res.status(404).json({
        message: " index not found"
    })
    tasks.splice(index, 1);
    return res.status(200).json({
        message: "succesfully deleted"
    })
})




app.listen(3000);
