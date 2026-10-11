
const request = require("supertest");
const app = require("../../app");
const { pool } = require("../../db/db");

const createdUserIds = [];

const getTask = (body) => body.task ?? body;

const getTasks = (body) => body.tasks ?? body;

const expectAccessDenied = (status) => {
    expect([403, 404]).toContain(status);
};

async function createUser(prefix) {
    const email =
        `${prefix}_${Date.now()}_${Math.random()
            .toString(36).slice(2)}@example.com`;

    const user = {
        name: "Task Test User",
        email,
        password: "Test12345"
    };

    const registration = await request(app)
        .post("/api/users")
        .send(user);

    expect(registration.status).toBe(201);

    createdUserIds.push(registration.body.user.id);

    const login = await request(app)
        .post("/api/users/login")
        .send({
            email: user.email,
            password: user.password
        });

    expect(login.status).toBe(200);

    return {
        token: login.body.token,
        id: registration.body.user.id
    };
}

async function createTask(token, title = "Test Task") {
    return request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title,
            completed: false
        });
}

describe("Task API Integration Tests", () => {

   
    test("Request without token should return 401", async () => {
        const response = await request(app)
            .get("/api/tasks");

        expect(response.status).toBe(401);
    });

    
    test("Authenticated user should create a task", async () => {
        const user = await createUser("create");

        const response = await createTask(
            user.token,
            "Learn testing"
        );

        expect(response.status).toBe(201);

        const task = getTask(response.body);

        expect(task).toHaveProperty("id");
        expect(task).toHaveProperty("title", "Learn testing");
    });

   
    test("User should retrieve their own tasks", async () => {
        const user = await createUser("list");

        const created = await createTask(
            user.token,
            "My task"
        );

        expect(created.status).toBe(201);

        const taskId = getTask(created.body).id;

        const response = await request(app)
            .get("/api/tasks")
            .set("Authorization", `Bearer ${user.token}`);

        expect(response.status).toBe(200);

        const tasks = getTasks(response.body);

        expect(Array.isArray(tasks)).toBe(true);
        expect(
            tasks.some((task) => task.id === taskId)
        ).toBe(true);
    });

   
    test("User should retrieve a task by ID", async () => {
        const user = await createUser("get");

        const created = await createTask(
            user.token,
            "Fetch this task"
        );

        expect(created.status).toBe(201);

        const taskId = getTask(created.body).id;

        const response = await request(app)
            .get(`/api/tasks/${taskId}`)
            .set("Authorization", `Bearer ${user.token}`);

        expect(response.status).toBe(200);
        expect(getTask(response.body))
            .toHaveProperty("title", "Fetch this task");
    });

   
    test("User should update a task using PUT", async () => {
        const user = await createUser("put");

        const created = await createTask(
            user.token,
            "Old title"
        );

        expect(created.status).toBe(201);

        const taskId = getTask(created.body).id;

        const response = await request(app)
            .put(`/api/tasks/${taskId}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send({
                title: "Updated title",
                completed: true
            });

        expect(response.status).toBe(200);
        expect(getTask(response.body))
            .toHaveProperty("title", "Updated title");
        expect(getTask(response.body))
            .toHaveProperty("completed", true);
    });

    
    test("User should partially update a task using PATCH", async () => {
        const user = await createUser("patch");

        const created = await createTask(
            user.token,
            "Original title"
        );

        expect(created.status).toBe(201);

        const taskId = getTask(created.body).id;

        const response = await request(app)
            .patch(`/api/tasks/${taskId}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send({
                title: "Patched title"
            });

        expect(response.status).toBe(200);
        expect(getTask(response.body))
            .toHaveProperty("title", "Patched title");
    });

   
    test("User should delete their own task", async () => {
        const user = await createUser("delete");

        const created = await createTask(
            user.token,
            "Task to delete"
        );

        expect(created.status).toBe(201);

        const taskId = getTask(created.body).id;

        const response = await request(app)
            .delete(`/api/tasks/${taskId}`)
            .set("Authorization", `Bearer ${user.token}`);

       
        expect([200, 204]).toContain(response.status);

        const check = await request(app)
            .get(`/api/tasks/${taskId}`)
            .set("Authorization", `Bearer ${user.token}`);

        expect(check.status).toBe(404);
    });

    
    test("Non-existent task should return 404", async () => {
        const user = await createUser("missing");

        const response = await request(app)
            .get("/api/tasks/2147483647")
            .set("Authorization", `Bearer ${user.token}`);

        expect(response.status).toBe(404);
    });

    
    test("User cannot retrieve another user's task", async () => {
        const userA = await createUser("owner");
        const userB = await createUser("stranger");

        const created = await createTask(
            userA.token,
            "Private task"
        );

        expect(created.status).toBe(201);

        const taskId = getTask(created.body).id;

        const response = await request(app)
            .get(`/api/tasks/${taskId}`)
            .set("Authorization", `Bearer ${userB.token}`);

        expectAccessDenied(response.status);
    });

    
    test("User cannot update another user's task", async () => {
        const userA = await createUser("ownerput");
        const userB = await createUser("strangerput");

        const created = await createTask(
            userA.token,
            "Original private task"
        );

        expect(created.status).toBe(201);

        const taskId = getTask(created.body).id;

        const response = await request(app)
            .put(`/api/tasks/${taskId}`)
            .set("Authorization", `Bearer ${userB.token}`)
            .send({
                title: "Unauthorized change",
                completed: true
            });

        expectAccessDenied(response.status);

        
        const check = await request(app)
            .get(`/api/tasks/${taskId}`)
            .set("Authorization", `Bearer ${userA.token}`);

        expect(check.status).toBe(200);
        expect(getTask(check.body))
            .toHaveProperty("title", "Original private task");
        expect(getTask(check.body))
            .toHaveProperty("completed", false);
    });

    
    test("User cannot PATCH another user's task", async () => {
        const userA = await createUser("ownerpatch");
        const userB = await createUser("strangerpatch");

        const created = await createTask(
            userA.token,
            "Protected task"
        );

        expect(created.status).toBe(201);

        const taskId = getTask(created.body).id;

        const response = await request(app)
            .patch(`/api/tasks/${taskId}`)
            .set("Authorization", `Bearer ${userB.token}`)
            .send({
                title: "Unauthorized patch"
            });

        expectAccessDenied(response.status);
    });

   
    test("User cannot delete another user's task", async () => {
        const userA = await createUser("ownerdelete");
        const userB = await createUser("strangerdelete");

        const created = await createTask(
            userA.token,
            "Do not delete"
        );

        expect(created.status).toBe(201);

        const taskId = getTask(created.body).id;

        const response = await request(app)
            .delete(`/api/tasks/${taskId}`)
            .set("Authorization", `Bearer ${userB.token}`);

        expectAccessDenied(response.status);

       
        const check = await request(app)
            .get(`/api/tasks/${taskId}`)
            .set("Authorization", `Bearer ${userA.token}`);

        expect(check.status).toBe(200);
        expect(getTask(check.body))
            .toHaveProperty("title", "Do not delete");
    });

    
    test("Task list should contain only the authenticated user's tasks", async () => {
        const userA = await createUser("listowner");
        const userB = await createUser("listother");

        const created = await createTask(
            userB.token,
            "Only User B should see this"
        );

        expect(created.status).toBe(201);

        const taskId = getTask(created.body).id;

        const response = await request(app)
            .get("/api/tasks")
            .set("Authorization", `Bearer ${userA.token}`);

        console.log("STATUS:", response.status);
console.log("BODY:", response.body);
        expect(response.status).toBe(200);

        const tasks = getTasks(response.body);

        expect(Array.isArray(tasks)).toBe(true);
        expect(
            tasks.some((task) => task.id === taskId)
        ).toBe(false);
    });

   
    afterAll(async () => {
        try {
            if (createdUserIds.length > 0) {
                await pool.query(
                    "DELETE FROM tasks WHERE user_id = ANY($1::int[])",
                    [createdUserIds]
                );

                await pool.query(
                    "DELETE FROM users WHERE id = ANY($1::int[])",
                    [createdUserIds]
                );
            }
        } finally {
            await pool.end();
        }
    });
});
