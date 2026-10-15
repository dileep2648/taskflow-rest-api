require("dotenv").config();

require("dotenv").config({
    path: ".env.test",
    override: true
});

delete process.env.DATABASE_URL;

console.log("TEST DATABASE:", process.env.DB_NAME);
console.log("DATABASE_URL exists:", Boolean(process.env.DATABASE_URL));

if (process.env.DB_NAME !== "taskflow_test") {
    throw new Error("Tests must run against taskflow_test!");
}