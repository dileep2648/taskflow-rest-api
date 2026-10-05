const logger =(req,res,next)=>{
    console.log("METHOD:", req.method);
    console.log("URL:", req.url);
    next();
}

    module.exports=logger;