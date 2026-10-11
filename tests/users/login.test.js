const request = require("supertest");
const app = require("../../app");
const jwt = require("jsonwebtoken");
const { pool } = require("../../db/db");

describe("User Login", () => {

    
    test("Valid credentials should return 200 and a JWT token", async () => {
        const email = `login_${Date.now()}@example.com`;
        const password = "Test12345";

        const registration = await request(app)
            .post("/api/users")
            .send({
                name: "Login Test User",
                email,
                password
            });

        expect(registration.status).toBe(201);

        const response = await request(app)
            .post("/api/users/login")
            .send({ email, password });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(typeof response.body.token).toBe("string");
        expect(response.body).toHaveProperty("user.id");
        expect(response.body).toHaveProperty("user.email", email);
        expect(response.body.user).not.toHaveProperty("password");
        expect(response.body.user).not.toHaveProperty("password_hash");
    });

   
    test("Non-existent email should return 401", async () => {
        const response = await request(app)
            .post("/api/users/login")
            .send({
                email: `missing_${Date.now()}@example.com`,
                password: "WrongPass123"
            });

        expect(response.status).toBe(401);
        expect(response.body.message)
            .toBe("Invalid email or password");
    });

   
    test("Incorrect password should return 401", async () => {
        const email = `wrongpass_${Date.now()}@example.com`;

        await request(app)
            .post("/api/users")
            .send({
                name: "Wrong Password User",
                email,
                password: "Correct123"
            });

        const response = await request(app)
            .post("/api/users/login")
            .send({
                email,
                password: "Incorrect123"
            });

        expect(response.status).toBe(401);
        expect(response.body.message)
            .toBe("Invalid email or password");
    });

   
    test("Missing body should return 400", async () => {
        const response = await request(app)
            .post("/api/users/login");

        expect(response.status).toBe(400);
    });

    
    test("Missing email should return 400", async () => {
        const response = await request(app)
            .post("/api/users/login")
            .send({ password: "Test12345" });

        expect(response.status).toBe(400);
    });

    
    test("Missing password should return 400", async () => {
        const response = await request(app)
            .post("/api/users/login")
            .send({ email: "test@example.com" });

        expect(response.status).toBe(400);
    });

    
    test("Invalid email format should return 400", async () => {
        const response = await request(app)
            .post("/api/users/login")
            .send({
                email: "invalid-email",
                password: "Test12345"
            });

        expect(response.status).toBe(400);
    });

   
    test("Empty email should return 400", async () => {
        const response = await request(app)
            .post("/api/users/login")
            .send({
                email: "",
                password: "Test12345"
            });

        expect(response.status).toBe(400);
    });

    
    test("Empty password should return 400", async () => {
        const response = await request(app)
            .post("/api/users/login")
            .send({
                email: "test@example.com",
                password: ""
            });

        expect(response.status).toBe(400);
    });

   
    test("Non-string email should return 400", async () => {
        const response = await request(app)
            .post("/api/users/login")
            .send({
                email: 123,
                password: "Test12345"
            });

        expect(response.status).toBe(400);
    });

   
    test("Non-string password should return 400", async () => {
        const response = await request(app)
            .post("/api/users/login")
            .send({
                email: "test@example.com",
                password: 12345
            });

        expect(response.status).toBe(400);
    });

   
    test("Unknown field should return 400", async () => {
        const response = await request(app)
            .post("/api/users/login")
            .send({
                email: "test@example.com",
                password: "Test12345",
                role: "admin"
            });

        expect(response.status).toBe(400);
    });

    
    test("Successful login should return a valid JWT", async () => {
        const email = `jwt_${Date.now()}@example.com`;
        const password = "Test12345";

        await request(app)
            .post("/api/users")
            .send({
                name: "JWT Test User",
                email,
                password
            });

        const response = await request(app)
            .post("/api/users/login")
            .send({ email, password });

        expect(response.status).toBe(200);

        const decoded = jwt.verify(
            response.body.token,
            process.env.JWT_SECRET
        );

        expect(decoded.sub).toBe(String(response.body.user.id));
        expect(decoded.exp).toBeDefined();
    });

    afterAll(async () => {
        await pool.end();
    });
});
