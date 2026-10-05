const validateTask= function (req,res,next) {
 
   const allowedFields = ["title", "completed"];

for (const field of Object.keys(req.body)) {
    if (!allowedFields.includes(field)) {
        return res.status(400).json({
            message: `Unknown field: ${field}`
        });
    }
}

if (!req.body.title) {
        return res.status(400).json({
            message: "Title is mandatory:]"
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


    if(req.body.completed===undefined)req.body.completed=false;
    if(typeof req.body.completed!=="boolean"){
       return res.status(400).json({
        message:"completed field must be a boolean"
       })
    }

    next();
}

module.exports= validateTask;