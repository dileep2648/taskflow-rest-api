const validateTaskId = (req, res, next) => {
    const taskId = req.params.id;
    if (!taskId) {
        return res.status(400).json({
            message: "Task ID is required"
        });
    }

    if (!/^[1-9]\d*$/.test(taskId)) {
    return res.status(400).json({
        message: "Task ID must be a positive integer"
    });
}


    next();
};

module.exports = validateTaskId;