const express = require("express");
const router = express.Router();

const { messageValidation } = require("../middlewares/messageValidations.js");
const validate = require("../middlewares/handleValidation");
const authGuard = require("../middlewares/authGuard");

// Controller
const { createMessage, getMessagesByConversation } = require("../controllers/MessageController.js");

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Endpoints relacionados às mensagens de conversas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f123abc456
 *         conversationId:
 *           type: string
 *           example: 64f456def789
 *         sender:
 *           type: string
 *           example: 64fuser123
 *         text:
 *           type: string
 *           example: "Olá, tudo bem?"
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Envia uma nova mensagem em uma conversa
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conversationId:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mensagem enviada com sucesso
 */
router.post("/", authGuard, messageValidation(), validate, createMessage);

/**
 * @swagger
 * /api/messages/{conversationId}:
 *   get:
 *     summary: Retorna mensagens paginadas de uma conversa
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: conversationId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da conversa
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página da paginação
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Quantidade de mensagens por página
 *     responses:
 *       200:
 *         description: Mensagens paginadas da conversa
 */
router.get("/:conversationId", authGuard, getMessagesByConversation);

module.exports = router;