import { api, requestConfig } from '../utils/config';

const likeComment = async (commentId, token) => {
  const config = requestConfig("PUT", null, token);

  try {
    const response = await fetch(`${api}/comments/${commentId}/like`, config);
    const res = await response.json();

    if (!response.ok) {
      return { errors: res.details || [res.message || "Erro ao curtir comentário"] };
    }

    return res;
  } catch (error) {
    console.error("Erro ao curtir comentário:", error);
    return { errors: ["Erro ao conectar ao servidor."] };
  }
};

const comment = async (photoId, data, token) => {
  const config = requestConfig("POST", data, token);

  try {
    const response = await fetch(`${api}/comments/${photoId}/`, config);
    const res = await response.json();

    if (!response.ok) {
      return { errors: res.details || [res.message || "Erro ao enviar comentário"] };
    }

    return res;
  } catch (error) {
    console.error("Erro ao enviar comentário:", error);
    return { errors: ["Erro ao enviar comentário"] };
  }
};

const getAllComments = async (token) => {
  const config = requestConfig("GET", null, token);

  try {
    const response = await fetch(`${api}/comments/`, config);
    const res = await response.json();

    if (!response.ok) {
      return { errors: res.details || [res.message || "Erro ao buscar comentários"] };
    }

    return res;
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    return { errors: ["Erro ao buscar comentários"] };
  }
};

const getCommentsByPhotoId = async (photoId, token) => {
  const config = requestConfig("GET", null, token);

  try {
    const response = await fetch(`${api}/comments/${photoId}`, config);
    const res = await response.json();

    if (!response.ok) {
      return { errors: res.details || [res.message || "Erro ao buscar comentário"] };
    }

    return res;
  } catch (error) {
    console.error("Erro ao buscar comentário:", error);
    return { errors: ["Erro ao buscar comentário"] };
  }
};

const commentService = {
  likeComment,
  comment,
  getAllComments,
  getCommentsByPhotoId
};

export default commentService;
