const bcrypt = require('bcrypt');
const { pool } = require("../db/db");
const AppError = require('../utils/AppError');
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const registerUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userEmail = userData.email;
    const userName = userData.name;
    try {
        const result = await pool.query(
            `INSERT INTO users (name,email,password_hash)
          VALUES ($1,$2,$3)
          RETURNING id,name,email`,
            [userName, userEmail, hashedPassword]
        );

        return result.rows[0];
    }

    catch (error) {
        if (error.code === "23505") {
            throw new AppError("Email already exists", 409);
        }

        else {
            throw error;
        }
    }

}

const loginUser = async (userData) => {
    const email = userData.email;
    const password = userData.password;
    const result = await pool.query(
        "SELECT password_hash ,id,email FROM users WHERE email=$1", [email]
    );
    if (result.rows.length === 0) {
        throw new AppError("Invalid email or password", 401);
    }
    const hashedPassword = result.rows[0].password_hash;
    const idS = String(result.rows[0].id);
    const id = result.rows[0].id;
    const userEmail = result.rows[0].email;
    const verified = await bcrypt.compare(password, hashedPassword);
    if (!verified) {
        throw new AppError("Invalid email or password", 401);
    }
    
    const token = jwt.sign({sub: idS},secret,{expiresIn:"15m"});
    const data ={
         token,
        user: {
            id,
            email: userEmail
        }
    }
    return data;
}

module.exports = { registerUser, loginUser };