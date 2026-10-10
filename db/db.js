const {Pool} = require("pg");
require("dotenv").config();

if(process.env.DB_PASSWORD === undefined){
    console.error("Database password is not set. Please set the DB_PASSWORD environment variable.");
    process.exit(1);
}

const pool = new Pool({
    user:"postgres",
    host: "localhost",
    database: "taskflow",
    password: process.env.DB_PASSWORD,
    port:5432
});


pool.on("error", (err) => {
    console.error("Unexpected PostgreSQL pool error:", err.message);
});


module.exports = {pool};