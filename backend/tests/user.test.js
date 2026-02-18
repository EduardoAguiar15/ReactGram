const request = require("supertest");
const app = require("../app");
const User = require("../models/User");

describe("User Controller", () => {


    it("deve registrar um usuário com sucesso", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .send({
                name: "Carlos Teste",
                email: "carlos@test.com",
                password: "123456",
                confirmPassword: "123456",
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("_id");
        expect(res.body).toHaveProperty("profileImage", "default.png");
        expect(res.body).toHaveProperty("token");

        const userDb = await User.findOne({ email: "carlos@test.com" });
        expect(userDb).not.toBeNull();
    });


    it("não deve registrar usuário se email já estiver cadastrado", async () => {
        await User.create({
            name: "Carlos Teste 2",
            email: "carlos@test2.com",
            password: await require("../utils/hash").hashPassword("123456"),
        });

        const res = await request(app)
            .post("/api/users/register")
            .send({
                name: "Carlos Testando",
                email: "carlos@test2.com",
                password: "12345678",
                confirmPassword: "12345678",
            });

        expect(res.status).toBe(422);
    });


    it("deve fazer login com sucesso", async () => {
        const user = await User.create({
            name: "Carlos Teste3",
            email: "carlos@test3.com",
            password: await require("../utils/hash").hashPassword("123456"),
        });

        const res = await request(app)
            .post("/api/users/login")
            .send({
                email: "carlos@test3.com",
                password: "123456",
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("_id");
        expect(res.body).toHaveProperty("token");
        expect(res.body).toHaveProperty("profileImage", "default.png");

        expect(res.body._id).toBe(user._id.toString());
    });


    it("não deve logar com senha incorreta", async () => {
        await User.create({
            name: "Usuário Erro",
            email: "erro@test4.com",
            password: await require("../utils/hash").hashPassword("123456"),
        });

        const res = await request(app)
            .post("/api/users/login")
            .send({
                email: "erro@test4.com",
                password: "senhaerrada",
            });

        expect(res.status).toBe(422);
    });


    it("deve atualizar o usuário com sucesso", async () => {
        const user = await User.create({
            name: "Carlos Original",
            email: "update@test.com",
            password: await require("../utils/hash").hashPassword("123456"),
            bio: "Bio antiga"
        });

        const loginRes = await request(app)
            .post("/api/users/login")
            .send({
                email: "update@test.com",
                password: "123456"
            });

        const token = loginRes.body.token;

        const res = await request(app)
            .put(`/api/users/`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Carlos Atualizado",
                bio: "Bio nova"
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("_id");
        expect(res.body.name).toBe("Carlos Atualizado");
        expect(res.body.bio).toBe("Bio nova");

        const updatedUser = await User.findById(user._id);
        expect(updatedUser.name).toBe("Carlos Atualizado");
        expect(updatedUser.bio).toBe("Bio nova");
    });


    it("não deve atualizar o usuário sem token", async () => {
        await User.create({
            name: "Carlos Original2",
            email: "update@test2.com",
            password: await require("../utils/hash").hashPassword("123456"),
            bio: "Bio antiga"
        });

        await request(app)
            .post("/api/users/login")
            .send({
                email: "update@test2.com",
                password: "123456"
            });

        const res = await request(app)
            .put(`/api/users/`)
            .send({
                name: "Carlos Atualizado",
                bio: "Bio nova"
            });

        expect(res.status).toBe(401);
        expect(res.body.errors[0]).toBe("Acesso negado!");
    });


    it("deve retornar um usuário pelo ID", async () => {
        const user = await User.create({
            name: "Buscar Usuário",
            email: "buscar@test.com",
            password: await require("../utils/hash").hashPassword("123456"),
        });

        const res = await request(app).get(`/api/users/${user._id}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("_id", user._id.toString());
        expect(res.body).toHaveProperty("name", "Buscar Usuário");
        expect(res.body).not.toHaveProperty("password");
    });


    it("deve retornar erro ao buscar usuário com ID inválido", async () => {
        await User.create({
            name: "Buscar Usuário",
            email: "buscar@test.com",
            password: await require("../utils/hash").hashPassword("123456"),
        });

        const res = await request(app).get("/api/users/123");

        expect(res.status).toBe(404);

    });


    it("deve retornar todos os usuários", async () => {
        await User.create({
            name: "User 1",
            email: "user1@test.com",
            password: await require("../utils/hash").hashPassword("123456"),
        });

        await User.create({
            name: "User 2",
            email: "user2@test.com",
            password: await require("../utils/hash").hashPassword("123456"),
        });

        const res = await request(app).get("/api/users/all");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(2);

        expect(res.body[0]).toHaveProperty("_id");
        expect(res.body[0]).toHaveProperty("name");
        expect(res.body[0]).not.toHaveProperty("password");
    });

});