const {registerUser,loginUser} = require("../services/userService");

const registerUserController = async (req, res, next) => {
    try {
        const result = await registerUser(req.body);
        return res.status(201).json({
            user:result
        });
    }
    catch (error){
        next(error);
    }
}

const loginUserController = async (req, res, next) => {
    try {
        const result = await loginUser(req.body);
        return res.status(200).json(result);
    }
    catch (error){
        next(error);
    }
}

module.exports = { registerUserController, loginUserController };