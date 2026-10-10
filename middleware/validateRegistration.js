const validateRegistration = (req, res, next) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const allowedFields = ["name", "email", "password"];


    if (!req.body ||typeof req.body !== "object" ||Array.isArray(req.body) ||Object.keys(req.body).length === 0) {
        return res.status(400).json({
            message: "Request body must be a non-empty JSON object"
        });
    }

    for (const field of Object.keys(req.body)) {
        if (!allowedFields.includes(field)) {
            return res.status(400).json({
                message: `Unknown field ${field}`
            })
        }
    }

    for (const field of allowedFields) {
        if (!Object.keys(req.body).includes(field)) {
            return res.status(400).json({
                message: `Missing field ${field}`
            });
        }
    }

    if (req.body.name !== undefined) {
        if (typeof req.body.name !== "string") {
            return res.status(400).json({
                message: "name must be a string"
            })
        }

        else if (req.body.name.trim() === "") {
            return res.status(400).json({
                message: "name must not be empty"
            });
        }
    }

    if (req.body.email !== undefined) {
        if (typeof req.body.email !== "string") {
            return res.status(400).json({
                message: "email must be a string"
            })
        }

        else if (req.body.email.trim() === "") {
            return res.status(400).json({
                message: "email must not be empty"
            });
        }

        else if (!emailRegex.test(req.body.email.trim())) {
            return res.status(400).json({
                message: "Enter a valid email"
            });
        }
    }


    if (req.body.password !== undefined) {
        if (typeof req.body.password !== "string") {
            return res.status(400).json({
                message: "password must be a string"
            })
        }

        else if (req.body.password.trim() === "") {
            return res.status(400).json({
                message: "password must not be empty"
            });
        }

        else if (req.body.password.length < 8) {
            return res.status(400).json({
                message: "password must be at least 8 characters long"
            });
        }


    }

    next();
}

module.exports = validateRegistration;