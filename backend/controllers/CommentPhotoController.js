const CommentService = require("../services/CommentPhotoService");

// LIKE A COMMENT
const likeComment = async (req, res) => {
  try {
    const result = await CommentService.likeComment(
      req.params.commentId,
      req.user._id
    );

    return res.status(200).json({
      liked: result.liked,
      commentId: result.commentId,
      userId: result.userId,
      message: result.liked ? "Like adicionado." : "Like removido."
    });

  } catch (error) {
    return res.status(error.status || 500).json({
      status: "error",
      message: error.userMessage || "Erro ao curtir comentário",
      details: error.details || [error.message || "Erro inesperado"],
    });
  }
};

// GET COMMENTS BY PHOTO ID
const getCommentsByPhotoId = async (req, res) => {
  try {
    const comments = await CommentService.getCommentsByPhotoId(req.params.photoId);

    return res.status(200).json(comments);

  } catch (error) {
    return res.status(error.status || 500).json({
      status: "error",
      message: error.userMessage || "Erro ao buscar comentários da foto",
      details: error.details || [error.message || "Erro inesperado"],
    });
  }
};

// GET ALL COMMENTS
const getAllComments = async (req, res) => {
  try {
    const comments = await CommentService.getAllComments();

    return res.status(200).json(comments);

  } catch (error) {
    return res.status(error.status || 500).json({
      status: "error",
      message: error.userMessage || "Erro ao buscar todos os comentários",
      details: error.details || [error.message || "Erro inesperado"],
    });
  }
};

// POST COMMENT OR REPLY
const postCommentOrReply = async (req, res) => {
  try {
    const result = await CommentService.postCommentOrReply(
      req.params.photoId,
      {
        comment: req.body.comment,
        replyTo: req.body.replyTo,
        user: req.user,
      }
    );

    if (result.type === "reply") {
      return res.status(201).json({
        message: "Resposta adicionada com sucesso!",
        comment: result.comment
      });
    }

    return res.status(201).json({
      message: "Comentário adicionada com sucesso!",
      comment: result.comment
    });

  } catch (error) {
    return res.status(error.status || 500).json({
      status: "error",
      message: error.userMessage || "Erro ao criar comentário",
      details: error.details || [error.message || "Erro inesperado"],
    });
  }
};

module.exports = {
  postCommentOrReply,
  getAllComments,
  likeComment,
  getCommentsByPhotoId
};