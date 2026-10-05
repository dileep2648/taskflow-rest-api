const queryValidator = (req, res, next) => {
    if (req.query.completed !== undefined) {
        if (req.query.completed !== "true" && req.query.completed !== "false") {
            return res.status(400).json({
                message: "Invalid value for 'completed' query parameter. Must be 'true' or 'false'"
            });
        }
    }

    if (req.query.search !== undefined) {
        if (req.query.search.trim() === "") {
            return res.status(400).json({
                message: "Invalid value for 'search' query parameter. Must not be an empty string"
            });
        }
    }


    if ((req.query.sort !== undefined && req.query.order === undefined) ||
        (req.query.sort === undefined && req.query.order !== undefined)) {
        return res.status(400).json({
            message: "sort and order must be provided together"
        });
    }

    else if (req.query.sort !== undefined && req.query.order !== undefined) {

        if (req.query.order !== "asc" && req.query.order !== "desc") {
            return res.status(400).json({
                message: "Invalid value for 'order' query parameter. Must be 'asc' or 'desc'"
            });
        }

        if (req.query.sort !== "title") {
            return res.status(400).json({
                message: "Invalid value for 'sort' query parameter. Must be 'title'"
            });
        }
    }


    if ((req.query.page !== undefined && req.query.limit === undefined) ||
        (req.query.page === undefined && req.query.limit !== undefined)) {
        return res.status(400).json({
            message: "page and limit must be provided together"
        });
    }
    else if ( req.query.page !== undefined &&
        req.query.limit !== undefined) {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);

        if (
            !Number.isInteger(page) ||
            !Number.isInteger(limit) ||
            page < 1 ||
            limit < 1
        ) {
            return res.status(400).json({
                message: "page and limit must be positive integers"
            });
        }
    }
    next();
}

module.exports = queryValidator;