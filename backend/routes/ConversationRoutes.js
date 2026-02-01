const express = require("express")
const router = express.Router()

const authGuard = require("../middlewares/authGuard");

// Controller
const { getUserConversations, getConversationBetween } = require("../controllers/ConversationController.js");

/**
 * @swagger
 * tags:
 *   name: Conversations
 *   description: Endpoints relacionados ao relacionamento de conversas entre dois usuários
 */

/**
 * @swagger
 * /conversations:
 *   get:
 *     summary: Retorna todos os relacionamentos de conversas do usuário autenticado
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de conversas do usuário
 *       401:
 *         description: Não autorizado
 */
router.get("/", authGuard, getUserConversations);

/**
 * @swagger
 * /conversations/{userId}:
 *   get:
 *     summary: Retorna a conversa entre o usuário autenticado e outro usuário específico
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do outro usuário
 *     responses:
 *       200:
 *         description: Conversa encontrada ou criada
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Conversa não encontrada
 */
router.get("/:userId", authGuard, getConversationBetween);

module.exports = router;