const Conversation = require("../models/Conversation");
const mongoose = require("mongoose");
const { InvalidIdError } = require("../errors/typeError");

async function getUserConversations(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new InvalidIdError();
    }

    const conversations = await Conversation.find({
        $or: [
            { senderId: userId },
            { receiverId: userId }
        ]
    })
        .populate("senderId", "-password")
        .populate("receiverId", "-password")
        .sort({ updatedAt: -1 });

    return conversations;
}

async function getConversationBetween(userId1, userId2) {
    if (
        !mongoose.Types.ObjectId.isValid(userId1) ||
        !mongoose.Types.ObjectId.isValid(userId2)
    ) {
        throw new InvalidIdError();
    }

    return await Conversation.findOne({
        $or: [
            { senderId: userId1, receiverId: userId2 },
            { senderId: userId2, receiverId: userId1 },
        ],
    })
        .populate("senderId", "-password")
        .populate("receiverId", "-password");
}

module.exports = {
    getUserConversations,
    getConversationBetween
};