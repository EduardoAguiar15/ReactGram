import { api, requestConfig } from "../utils/config";

export const getUserConversations = async (token) => {
  const config = requestConfig("GET", null, token);
  try {
    const response = await fetch(`${api}/conversations`, config);
    const res = await response.json();

    if (!response.ok) {
      return { errors: res.details || [res.message || "Erro ao buscar conversas do usuário"] };
    }

    return res;
  } catch (error) {
    console.error("Erro ao buscar conversas do usuário:", error);
    return { errors: ["Erro ao buscar conversas do usuário"] };
  }
};

export const getConversationBetween = async (token, userId) => {
  const config = requestConfig("GET", null, token);
  try {
    const response = await fetch(`${api}/conversations/${userId}`, config);
    const res = await response.json();

    if (!response.ok) {
      return { errors: res.details || [res.message || "Erro ao buscar conversa entre usuários"] };
    }

    return res;
  } catch (error) {
    console.error("Erro ao buscar conversa entre usuários:", error);
    return { errors: ["Erro ao buscar conversas do usuário"] };
  }
};

const conversationService = {
  getConversationBetween,
  getUserConversations,
};

export default conversationService;