const express = require("express");
const logger = require("./middleware/logger");
const taskRoutes =require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler=require("./middleware/errorHandler");


const app = express();
app.use(express.json());
app.use(logger);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});   
app.use(errorHandler)


module.exports = app;