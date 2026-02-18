const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const { hashPassword } = require("../utils/hash");

describe("Conversation Controller", () => {

    async function createUserAndLogin(email) {
        await User.create({
            name: "User",
            email,
            password: await hashPassword("123456")
        });

        const res = await request(app)
            .post("/api/users/login")
            .send({ email, password: "123456" });

        return res.body.token;
    }

    async function createUser(email) {
        return User.create({
            name: "User",
            email,
            password: await hashPassword("123456")
        });
    }


    it("deve retornar todas as conversas do usuário logado", async () => {
        const token = await createUserAndLogin("user1@test.com");

        const user1 = await User.findOne({ email: "user1@test.com" });
        const user2 = await createUser("user2@test.com");
        const user3 = await createUser("user3@test.com");

        await Conversation.create({
            senderId: user1._id,
            receiverId: user2._id
        });

        await Conversation.create({
            senderId: user3._id,
            receiverId: user1._id
        });

        await Conversation.create({
            senderId: user2._id,
            receiverId: user3._id
        });

        const res = await request(app)
            .get("/api/conversations")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);

        res.body.forEach(conv => {
            expect(
                conv.senderId._id === user1._id.toString() ||
                conv.receiverId._id === user1._id.toString()
            ).toBe(true);
        });
    });


    it("deve retornar array vazio quando o usuário não tem conversas", async () => {
        const token = await createUserAndLogin("semconversa@test.com");

        const res = await request(app)
            .get("/api/conversations")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });


    it("deve retornar a conversa entre dois usuários", async () => {
        const token = await createUserAndLogin("userA@test.com");

        const userA = await User.findOne({ email: "userA@test.com" });
        const userB = await createUser("userB@test.com");

        const conversation = await Conversation.create({
            senderId: userA._id,
            receiverId: userB._id
        });

        const res = await request(app)
            .get(`/api/conversations/${userB._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body._id).toBe(conversation._id.toString());
        expect(
            res.body.senderId._id === userA._id.toString() ||
            res.body.receiverId._id === userA._id.toString()
        ).toBe(true);
    });


    it("deve retornar null quando não existir conversa entre os usuários", async () => {
        const token = await createUserAndLogin("userC@test.com");

        const userC = await User.findOne({ email: "userC@test.com" });
        const userD = await createUser("userD@test.com");

        const res = await request(app)
            .get(`/api/conversations/${userD._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toBeNull();
    });


    it("deve retornar erro 400 se o ID for inválido", async () => {
        const token = await createUserAndLogin("userE@test.com");

        const res = await request(app)
            .get("/api/conversations/id-invalido")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body.status).toBe("error");
        expect(res.body.message).toMatch(/ID inválido/i);
    });
});