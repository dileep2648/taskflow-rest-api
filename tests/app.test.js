const request = require("supertest");
const app = require("../app");

describe("TaskFlow API", () => {

    test("Unknown routes should return 404", async () => {

        const response = await request(app).get("/this-route-does-not-exist");

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Route not found");

    });

    test("GET /api/tasks without a token should return 401", async () => {
        const response = await request(app).get("/api/tasks");

        expect(response.status).toBe(401);
    });

    test("POST/api/users/login without body", async () => {
        const response = await request(app).post("/api/users/login");
        expect(response.status).toBe(400);
    });

    test("Registration without a body should return 400", async () => {
        const response = await request(app).post("/api/users");

        expect(response.status).toBe(400);
    });

    

});