const {Pool} = require("pg");
require("dotenv").config();

const pool = new Pool({
    user:"postgres",
    host: "localhost",
    database: "taskflow",
    password: process.env.DB_PASSWORD,
    port:5432
});


const testDB = async ()=>{
    const result = await pool.query("SELECT * FROM tasks");
    console.log(result.rows);
}


module.exports = {pool};