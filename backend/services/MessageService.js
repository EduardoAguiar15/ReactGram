const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const mongoose = require("mongoose");
const { InvalidIdError, CreateMessageError } = require("../errors/typeError");

async function createMessage({ senderId, receiverId, text }) {
    if (!receiverId || !text) {
        throw new CreateMessageError();
    }

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
        throw new InvalidIdError();
    }

    let conversation = await Conversation.findOne({
        $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId }
        ]
    });

    if (!conversation) {
        conversation = await Conversation.create({
            senderId,
            receiverId,
            lastMessage: text
        });
    } else {
        conversation.lastMessage = text;
        conversation.updatedAt = new Date();
        await conversation.save();
    }

    const message = await Message.create({
        conversationId: conversation._id,
        sender: senderId,
        receiver: receiverId,
        text,
        read: false
    });

    const populatedMessage = await Message.findById(message._id)
        .populate("sender", "-password")
        .populate("receiver", "-password");

    return populatedMessage;
}

async function getMessagesByConversation(conversationId, page = 1, limit = 20) {
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        throw new InvalidIdError();
    }

    const skip = (page - 1) * limit;

    const [messages, totalMessages] = await Promise.all([
        Message.find({ conversationId })
            .populate("sender", "-password")
            .populate("receiver", "-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),

        Message.countDocuments({ conversationId })
    ]);

    return {
        messages,
        page,
        limit,
        totalMessages,
        totalPages: Math.ceil(totalMessages / limit)
    };
}

module.exports = {
    createMessage,
    getMessagesByConversation
};