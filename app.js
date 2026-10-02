const express = require("express");
const logger = require("./middlewear/logger");
const taskRoutes =require("./routes/taskRoutes");
const errorHandler=require("./middlewear/errorHandler");


const app = express();
app.use(express.json());
app.use(logger);
app.use("/api/tasks", taskRoutes);
app.use(errorHandler)

app.get("/test", (req, res) => {
    res.send("App.js is connected!");
});

module.exports = app;