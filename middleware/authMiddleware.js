const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
require("dotenv").config();
const AppError =require("../utils/AppError");

const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new AppError("Authorization header is missing", 401);
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        throw new AppError("Token is missing", 401);
    }
    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        throw new AppError("Invalid or expired token", 401);
    }
};
module.exports = authMiddleware;