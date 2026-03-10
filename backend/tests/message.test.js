const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const { hashPassword } = require("../utils/hash");

describe("Message Controller", () => {

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

    it("deve criar mensagem e conversa quando não existir", async () => {
        const token = await createUserAndLogin("sender@test.com");
        const sender = await User.findOne({ email: "sender@test.com" });
        const receiver = await createUser("receiver@test.com");

        const res = await request(app)
            .post("/api/messages")
            .set("Authorization", `Bearer ${token}`)
            .send({
                receiverId: receiver._id,
                text: "Olá"
            });

        expect(res.status).toBe(201);
        expect(res.body.text).toBe("Olá");

        const conversation = await Conversation.findOne({
            senderId: sender._id,
            receiverId: receiver._id
        });

        expect(conversation).toBeTruthy();
    });


    it("deve criar mensagem usando conversa existente", async () => {
        const token = await createUserAndLogin("sender2@test.com");
        const sender = await User.findOne({ email: "sender2@test.com" });
        const receiver = await createUser("receiver2@test.com");

        const conversation = await Conversation.create({
            senderId: sender._id,
            receiverId: receiver._id,
            lastMessage: "Mensagem antiga"
        });

        const res = await request(app)
            .post("/api/messages")
            .set("Authorization", `Bearer ${token}`)
            .send({
                receiverId: receiver._id,
                text: "Nova mensagem"
            });

        expect(res.status).toBe(201);
        expect(res.body.text).toBe("Nova mensagem");

        expect(res.body.conversationId)
            .toBe(conversation._id.toString());

        const updatedConversation = await Conversation.findById(conversation._id);
        expect(updatedConversation.lastMessage).toBe("Nova mensagem");
    });


    it("deve buscar mensagens mais recentes primeiro com paginação", async () => {
        const token = await createUserAndLogin("order@test.com");
        const sender = await User.findOne({ email: "order@test.com" });
        const receiver = await createUser("order2@test.com");

        const conversation = await Conversation.create({
            senderId: sender._id,
            receiverId: receiver._id
        });

        await Message.create({
            conversationId: conversation._id,
            sender: sender._id,
            receiver: receiver._id,
            text: "Primeira"
        });

        await Message.create({
            conversationId: conversation._id,
            sender: receiver._id,
            receiver: sender._id,
            text: "Segunda"
        });

        const res = await request(app)
            .get(`/api/messages/${conversation._id}?page=1&limit=20`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);

        expect(res.body.messages.length).toBe(2);
        expect(res.body.messages[0].text).toBe("Segunda");
        expect(res.body.messages[1].text).toBe("Primeira");

        expect(res.body.page).toBe(1);
        expect(res.body.totalMessages).toBe(2);
        expect(res.body.totalPages).toBe(1);
    });


    it("deve retornar 400 se conversationId for inválido", async () => {
        const token = await createUserAndLogin("userinvalid@test.com");

        const res = await request(app)
            .get("/api/messages/abc")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body.status).toBe("error");
        expect(res.body.message).toMatch(/id inválido/i);
    });
});