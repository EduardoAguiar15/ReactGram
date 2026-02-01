const express = require("express")
const router = express.Router()

const validate = require("../middlewares/handleValidation");
const authGuard = require("../middlewares/authGuard");
const { commentValidation } = require("../middlewares/commentValidation.js");

// Controller
const { postCommentOrReply, getAllComments, getCommentsByPhotoId, likeComment } = require("../controllers/CommentPhotoController.js");

// Exemplo de rota
// router.post("/", authGuard, conversationValidation(), validate, createConversation)

/**
 * @swagger
 * /comments/{photoId}:
 *   post:
 *     summary: Cria um comentário ou uma resposta a um comentário em uma foto
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: photoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da foto onde o comentário será criado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 description: Texto do comentário
 *               replyTo:
 *                 type: string
 *                 description: ID do comentário pai (somente quando for resposta)
 *           examples:
 *             ComentarioSimples:
 *               summary: Exemplo de comentário simples
 *               value:
 *                 comment: "Foto incrível!"
 *             RespostaAComentario:
 *               summary: Exemplo de resposta a um comentário
 *               value:
 *                 comment: "Obrigado!"
 *                 replyTo: "691ca2c0022e4f172d90d51b"
 *     responses:
 *       201:
 *         description: Comentário ou resposta criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post("/:photoId", commentValidation(), authGuard, validate, postCommentOrReply);


/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Retorna todos os comentários e respostas a comentários do sistema
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de comentários
 *       401:
 *         description: Não autorizado
 */
router.get("/", authGuard, getAllComments);

/**
 * @swagger
 * /comments/{photoId}:
 *   get:
 *     summary: Obtém os comentários e respostas a comentários de uma foto específica
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: photoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da foto
 *     responses:
 *       200:
 *         description: Comentários retornados com sucesso
 *       401:
 *         description: Não autorizado
 */
router.get("/:photoId", authGuard, getCommentsByPhotoId);

/**
 * @swagger
 * /comments/{commentId}/like:
 *   put:
 *     summary: Dá like ou remove like de um comentário
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do comentário
 *     responses:
 *       200:
 *         description: Like atualizado
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Comentário não encontrado
 */
router.put("/:commentId/like", authGuard, likeComment);

module.exports = router;