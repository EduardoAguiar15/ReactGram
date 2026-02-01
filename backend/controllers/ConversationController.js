const ConversationService = require("../services/ConversationService");

// GET ALL CONVERSATIONS FOR USER
const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await ConversationService.getUserConversations(userId);

    return res.status(200).json(conversations);
  } catch (error) {
    return res.status(error.status || 500).json({
      status: "error",
      message: error.userMessage || "Erro ao buscar todas as conversas de usuário",
      details: error.details || [error.message || "Erro inesperado"],
    });
  }
};

// GET CONVERSATION BETWEEN TWO USERS
const getConversationBetween = async (req, res) => {
  try {
    const conversation = await ConversationService.getConversationBetween(
      req.user._id,
      req.params.userId
    );

    return res.status(200).json(conversation || null);
  } catch (error) {
    return res.status(error.status || 500).json({
      status: "error",
      message: error.userMessage || "Erro ao buscar conversa entre dois usuários",
      details: error.details || [error.message || "Erro inesperado"],
    });
  }
};

module.exports = {
  getUserConversations,
  getConversationBetween
};
