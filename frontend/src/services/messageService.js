import { api, requestConfig } from "../utils/config";

// Enviar (criar) mensagem
export const sendMessage = async (token, receiverId, text) => {
  const config = requestConfig("POST", { receiverId, text }, token);
  try {
    const response = await fetch(`${api}/messages`, config);

    if (!response.ok) {
      throw new Error("Erro ao enviar mensagem");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return { errors: ["Erro ao enviar mensagem."] };
  }
};

// Buscar mensagens de uma conversa
export const getMessagesByConversation = async (token, conversationId, page = 1, limit = 20) => {
  const config = requestConfig("GET", null, token);
  try {
    const response = await fetch(`${api}/messages/${conversationId}?page=${page}&limit=${limit}`, config);

    if (!response.ok) {
      throw new Error("Erro ao buscar mensagens");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return { errors: ["Erro ao buscar mensagens."] };
  }
};

const messageService = {
  sendMessage,
  getMessagesByConversation,
};

export default messageService;