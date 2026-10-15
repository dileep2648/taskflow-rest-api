const {Pool} = require("pg");
require("dotenv").config();

if(process.env.DB_PASSWORD === undefined){
    console.error("Database password is not set. Please set the DB_PASSWORD environment variable.");
    process.exit(1);
}
console.log("Database connection mode:", process.env.DATABASE_URL
    ? "DATABASE_URL"
    : "DB_* variables");

const useNeon =
    process.env.NODE_ENV === "production" &&
    Boolean(process.env.DATABASE_URL);

const pool = new Pool(
    useNeon
        ? {
            connectionString: process.env.DATABASE_URL
        }
        : {
            user: process.env.DB_USER || "postgres",
            host: process.env.DB_HOST || "localhost",
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT) || 5432
        }
);

pool.on("error", (err) => {
    console.error("Unexpected PostgreSQL pool error:", err.message);
});


module.exports = {pool};