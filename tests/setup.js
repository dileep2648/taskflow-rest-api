require("dotenv").config();
require("dotenv").config({
    path: ".env.test",
    override: true
});

if (process.env.DB_NAME !== "taskflow_test") {
    throw new Error("Tests must run against taskflow_test!");
}