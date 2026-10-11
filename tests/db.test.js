const { pool } = require("../db/db");

describe("Test Database Connection", () => {

    test("Should connect to taskflow_test", async () => {
        expect(process.env.DB_NAME).toBe("taskflow_test");

        const result = await pool.query("SELECT current_database()");

        expect(result.rows[0].current_database).toBe("taskflow_test");
    });

    afterAll(async () => {
    await pool.end();
});

});