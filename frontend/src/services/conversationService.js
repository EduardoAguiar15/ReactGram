import { api, requestConfig } from "../utils/config";

export const getUserConversations = async (token) => {
  const config = requestConfig("GET", null, token);
  try {
    const response = await fetch(`${api}/conversations`, config);

    if (!response.ok) {
      throw new Error("Erro ao buscar conversas do usuário");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar conversas do usuário:", error);
    return { errors: ["Erro ao buscar conversas do usuário"] };
  }
};

// Busca a conversa entre o usuário atual e outro usuário
export const getConversationBetween = async (token, userId) => {
  const config = requestConfig("GET", null, token);
  try {
    const response = await fetch(`${api}/conversations/${userId}`, config);

    if (!response.ok) {
      throw new Error("Erro ao buscar conversa entre usuários");
    }

    const data = await response.json();
    // data pode ser null se não existir conversa ainda
    return data;
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