const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const { hashPassword } = require("../utils/hash");

describe("Conversation Controller - getUserConversations", () => {

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

    // RETORNA TODAS AS CONVERSAS DO USUÁRIO
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

    // RETORNA ARRAY DE CONVERSAS VAZIO
    it("deve retornar array vazio quando o usuário não tem conversas", async () => {
        const token = await createUserAndLogin("semconversa@test.com");

        const res = await request(app)
            .get("/api/conversations")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });
});