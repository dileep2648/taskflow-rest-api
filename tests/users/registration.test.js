const request = require("supertest");
const app = require("../../app");
const { pool } = require("../../db/db");

describe("POST /api/users - Registration Tests", () => {

    test("Missing request body should return 400", async () => {
        const response = await request(app)
            .post("/api/users");

        expect(response.status).toBe(400);
    });

    test("Empty body should return 400", async () => {
        const response = await request(app)
            .post("/api/users")
            .send({});

        expect(response.status).toBe(400);
    });

    test("Missing name should return 400", async () => {
        const response = await request(app)
            .post("/api/users")
            .send({
                email: "test@example.com",
                password: "Test12345"
            });

        expect(response.status).toBe(400);
    });

    test("Missing email should return 400", async () => {
        const response = await request(app)
            .post("/api/users")
            .send({
                name: "Test User",
                password: "Test12345"
            });

        expect(response.status).toBe(400);
    });

    test("Missing password should return 400", async () => {
        const response = await request(app)
            .post("/api/users")
            .send({
                name: "Test User",
                email: "test@example.com"
            });

        expect(response.status).toBe(400);
    });

    test("Invalid email should return 400", async () => {
        const response = await request(app)
            .post("/api/users")
            .send({
                name: "Test User",
                email: "invalid-email",
                password: "Test12345"
            });

        expect(response.status).toBe(400);
    });

    test("Empty name should return 400", async () => {
        const response = await request(app)
            .post("/api/users")
            .send({
                name: "   ",
                email: "test@example.com",
                password: "Test12345"
            });

        expect(response.status).toBe(400);
    });

    test("Empty email should return 400", async () => {
        const response = await request(app)
            .post("/api/users")
            .send({
                name: "Test User",
                email: "",
                password: "Test12345"
            });

        expect(response.status).toBe(400);
    });

    test("Empty password should return 400", async () => {
        const response = await request(app)
            .post("/api/users")
            .send({
                name: "Test User",
                email: "test@example.com",
                password: ""
            });

        expect(response.status).toBe(400);
    });

    test("Short password should return 400", async () => {
        const response = await request(app)
            .post("/api/users")
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "abc123"
            });

        expect(response.status).toBe(400);
    });

    test("Unknown field should return 400", async () => {
        const response = await request(app)
            .post("/api/users")
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "Test12345",
                role: "admin"
            });

        expect(response.status).toBe(400);
    });

    test("Non-string password should return 400", async () => {
        const response = await request(app)
            .post("/api/users")
            .send({
                name: "Test User",
                email: "test@example.com",
                password: 12345678
            });

        expect(response.status).toBe(400);
    });

    test("Non-string email should return 400", async () => {
        const response = await request(app)
            .post("/api/users")
            .send({
                name: "Test User",
                email: 12345,
                password: "Test12345"
            });

        expect(response.status).toBe(400);
    });

    test("Non-string name should return 400", async () => {
        const response = await request(app)
            .post("/api/users")
            .send({
                name: 12345,
                email: "test@example.com",
                password: "Test12345"
            });

        expect(response.status).toBe(400);
    });

    test("Successful registration should return 201", async () => {
        const email = `test_${Date.now()}@example.com`;

        const response = await request(app)
            .post("/api/users")
            .send({
                name: "Test User",
                email: email,
                password: "Test12345"
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("user.id");
        expect(response.body).toHaveProperty("user.name", "Test User");
        expect(response.body).toHaveProperty("user.email", email);
        expect(response.body.user).not.toHaveProperty("password");
        expect(response.body.user).not.toHaveProperty("password_hash");
    });

    test("Duplicate email should return 409", async () => {
    const email = `duplicate_${Date.now()}@example.com`;

    const user = {
        name: "Test User",
        email,
        password: "Test12345"
    };

    const firstResponse = await request(app)
        .post("/api/users")
        .send(user);

    expect(firstResponse.status).toBe(201);

    const secondResponse = await request(app)
        .post("/api/users")
        .send(user);

    expect(secondResponse.status).toBe(409);
});
    
    afterAll(async () => {
        await pool.end();
    });
});