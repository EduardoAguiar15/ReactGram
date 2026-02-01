const express = require("express");
const router = express.Router();

// Controller
const {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  searchPhotos
} = require("../controllers/PhotoController");

// Middlewares
const { photoInsertValidation, photoUpdateValidation } = require("../middlewares/photoValidation");
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");
const imageUpload = require("../middlewares/imageUpload");

/**
 * @swagger
 * tags:
 *   name: Photos
 *   description: Endpoints relacionados às fotos
 */

/**
 * @swagger
 * /api/photos:
 *   post:
 *     summary: Publica uma nova foto
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Foto criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/insert", authGuard, imageUpload.single("image"), photoInsertValidation(), validate, insertPhoto);

/**
 * @swagger
 * /api/photos/{id}:
 *   delete:
 *     summary: Remove uma foto pelo ID
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Foto removida com sucesso
 *       404:
 *         description: Foto não encontrada
 */
router.delete("/:id", authGuard, deletePhoto);

/**
 * @swagger
 * /api/photos/search:
 *   get:
 *     summary: Busca fotos por palavra-chave
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: q
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Termo para busca
 *     responses:
 *       200:
 *         description: Lista de fotos encontradas
 */
router.get("/search", authGuard, searchPhotos);

/**
 * @swagger
 * /api/photos/user/{id}:
 *   get:
 *     summary: Lista fotos de um usuário específico
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de fotos do usuário
 */
router.get("/user/:id", authGuard, getUserPhotos);

/**
 * @swagger
 * /api/photos/{photoId}:
 *   get:
 *     summary: Retorna os dados de uma foto pelo ID
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: photoId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados da foto
 *       404:
 *         description: Foto não encontrada
 */
router.get("/:photoId", authGuard, getPhotoById);

/**
 * @swagger
 * /api/photos/{id}:
 *   put:
 *     summary: Atualiza os dados de uma foto
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Foto atualizada
 *       404:
 *         description: Foto não encontrada
 */
router.put("/:id", authGuard, photoUpdateValidation(), validate, updatePhoto);

/**
 * @swagger
 * /api/photos/{id}/like:
 *   put:
 *     summary: Curte ou descurte uma foto
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like atualizado
 *       404:
 *         description: Foto não encontrada
 */
router.put("/:id/like", authGuard, likePhoto);

/**
 * @swagger
 * /api/photos:
 *   get:
 *     summary: Retorna todas as fotos
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas as fotos
 */
router.get("/", authGuard, getAllPhotos);

module.exports = router;