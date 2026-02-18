const MessageService = require("../services/MessageService");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const { hashPassword } = require("../utils/hash");
const { InvalidIdError, CreateMessageError } = require("../errors/typeError");

async function createUser(email) {
    return User.create({
        name: "User",
        email,
        password: await hashPassword("123456")
    });
}


it("deve criar mensagem e criar conversa quando não existir", async () => {
    const sender = await createUser("sender@test.com");
    const receiver = await createUser("receiver@test.com");

    const message = await MessageService.createMessage({
        senderId: sender._id,
        receiverId: receiver._id,
        text: "Olá"
    });

    expect(message.text).toBe("Olá");
    expect(message.sender._id.toString()).toBe(sender._id.toString());

    const conversation = await Conversation.findOne({
        senderId: sender._id,
        receiverId: receiver._id
    });

    expect(conversation).toBeTruthy();
    expect(conversation.lastMessage).toBe("Olá");
});


it("deve criar mensagem usando conversa existente", async () => {
    const sender = await createUser("sender2@test.com");
    const receiver = await createUser("receiver2@test.com");

    const conversation = await Conversation.create({
        senderId: sender._id,
        receiverId: receiver._id,
        lastMessage: "Mensagem antiga"
    });

    const message = await MessageService.createMessage({
        senderId: sender._id,
        receiverId: receiver._id,
        text: "Nova mensagem"
    });

    expect(message.conversationId.toString())
        .toBe(conversation._id.toString());

    const updatedConversation = await Conversation.findById(conversation._id);
    expect(updatedConversation.lastMessage).toBe("Nova mensagem");
});


it("deve lançar erro se receiverId for inválido", async () => {
    const sender = await createUser("invalid@test.com");

    await expect(
        MessageService.createMessage({
            senderId: sender._id,
            receiverId: "123",
            text: "Oi"
        })
    ).rejects.toBeInstanceOf(InvalidIdError);
});


it("deve lançar erro se faltar texto", async () => {
    const sender = await createUser("missing@test.com");
    const receiver = await createUser("missing2@test.com");

    await expect(
        MessageService.createMessage({
            senderId: sender._id,
            receiverId: receiver._id,
            text: ""
        })
    ).rejects.toBeInstanceOf(CreateMessageError);
});


it("deve buscar mensagens mais recentes primeiro com paginação", async () => {
    const sender = await createUser("order@test.com");
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

    const result = await MessageService.getMessagesByConversation(
        conversation._id,
        1,
        20
    );

    expect(result.messages.length).toBe(2);
    expect(result.messages[0].text).toBe("Segunda");
    expect(result.messages[1].text).toBe("Primeira");
    expect(result.page).toBe(1);
    expect(result.totalMessages).toBe(2);
    expect(result.totalPages).toBe(1);
});


it("deve lançar erro se conversationId for inválido", async () => {
    await expect(
        MessageService.getMessagesByConversation("abc")
    ).rejects.toBeInstanceOf(InvalidIdError);
});