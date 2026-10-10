const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (
        err instanceof SyntaxError &&
        err.status === 400 &&
        "body" in err
    ) {
        return res.status(400).json({
            message: "Invalid JSON body"
        });
    }

    const statusCode = err.statusCode || 500;

    const message = statusCode >= 500
        ? "Internal Server Error"
        : err.message || "Something went wrong";

    return res.status(statusCode).json({
        message: message
    });
};

module.exports = errorHandler;