const patchValidator = (req, res, next) => {


 const   allowedFields = ["title","completed"];

    for (const field of Object.keys(req.body)) {
        if (!allowedFields.includes(field)) {
            return res.status(400).json({
                message: `Unknown Field ${field}`
            })
        }
    }

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            message: "The body cannot be empty"
        });
    }

    if(req.body.title!==undefined){
           if(typeof req.body.title!=="string"){
               return res.status(400).json({
                message:"Title must be a string"
               })
           }

           if(req.body.title.trim()===""){
            return res.status(400).json({
                message:"the title must not be empty string"
               })
           }
    }

    if(req.body.completed !== undefined){
     if(typeof req.body.completed!=="boolean"){
       return res.status(400).json({
        message:"completed field must be a boolean"
       })
    }}

next();
}

module.exports = patchValidator;