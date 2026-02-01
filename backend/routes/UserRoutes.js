const express = require("express");
const router = express.Router();

// Controller
const { register, login, getCurrentUser, update, getUserById, getAllUsers } = require("../controllers/UserController");

// Middlewares
const validate = require("../middlewares/handleValidation");
const { userCreateValidation, loginValidation, userUpdateValidation } = require("../middlewares/userValidations");
const authGuard = require("../middlewares/authGuard");
const imageUpload = require("../middlewares/imageUpload");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints relacionados aos usuários
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/register", userCreateValidation(), validate, register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Realiza login
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", loginValidation(), validate, login);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Retorna o usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Dados do usuário
 *       401:
 *         description: Token inválido
 */
router.get("/profile", authGuard, getCurrentUser);

/**
 * @swagger
 * /api/users:
 *   put:
 *     summary: Atualiza usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     responses:
 *       200:
 *         description: Usuário atualizado
 */
router.put("/", authGuard, userUpdateValidation(), validate, imageUpload.single("profileImage"), update);

/**
 * @swagger
 * /api/users/all:
 *   get:
 *     summary: Retorna todos os usuários
 *     tags: [Users]
 */
router.get("/all", getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Busca usuário por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/:id", getUserById);

module.exports = router;