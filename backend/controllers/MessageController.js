const MessageService = require("../services/MessageService");

// SEND A MESSAGE AND START A CONVERSATION IF NEEDED
const createMessage = async (req, res) => {
  try {
    const senderId = req.user._id;

    const message = await MessageService.createMessage({
      senderId,
      receiverId: req.body.receiverId,
      text: req.body.text
    });

    return res.status(201).json(message);

  } catch (error) {
    return res.status(error.status || 500).json({
      status: "error",
      message: error.userMessage || "Erro ao criar mensagem",
      details: error.details || [error.message || "Erro inesperado"],
    });
  }
};

// GET MESSAGES BY CONVERSATION ID
const getMessagesByConversation = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const messages = await MessageService.getMessagesByConversation(
      req.params.conversationId,
      Number(page),
      Number(limit)
    );

    return res.status(200).json(messages);

  } catch (error) {
    return res.status(error.status || 500).json({
      status: "error",
      message: error.userMessage || "Erro ao buscar mensagens",
      details: error.details || [error.message || "Erro inesperado"],
    });
  }
};

module.exports = { createMessage, getMessagesByConversation };