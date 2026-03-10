import { api, requestConfig } from "../utils/config";

export const sendMessage = async (token, receiverId, text) => {
  const config = requestConfig("POST", { receiverId, text }, token);
  try {
    const response = await fetch(`${api}/messages`, config);
    const res = await response.json();

    if (!response.ok) {
      return { errors: res.details || [res.message || "Erro ao enviar mensagem"] };
    }

    return res;
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return { errors: ["Erro ao enviar mensagem."] };
  }
};

export const getMessagesByConversation = async (token, conversationId, page = 1, limit = 20) => {
  const config = requestConfig("GET", null, token);
  try {
    const response = await fetch(`${api}/messages/${conversationId}?page=${page}&limit=${limit}`, config);
    const res = await response.json();

    if (!response.ok) {
      return { errors: res.details || [res.message || "Erro ao buscar mensagens"] };
    }

    return res;
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