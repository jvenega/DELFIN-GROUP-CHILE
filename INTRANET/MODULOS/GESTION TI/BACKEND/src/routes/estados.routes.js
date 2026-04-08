const express = require("express");
const router = express.Router();
const controller = require("../controllers/estados.controller");

/**
 * @swagger
 * tags:
 *   name: Estados
 *   description: Gestión de estados del sistema
 */

/**
 * @swagger
 * /estados:
 *   get:
 *     summary: Obtener todos los estados
 *     tags: [Estados]
 *     responses:
 *       200:
 *         description: Lista de estados
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 nombre: "Disponible"
 *               - id: 2
 *                 nombre: "Asignado"
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /estados:
 *   post:
 *     summary: Crear un estado
 *     tags: [Estados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: "En mantenimiento"
 *     responses:
 *       201:
 *         description: Estado creado correctamente
 */
router.post("/", controller.create);

/**
 * @swagger
 * /estados/{id}:
 *   put:
 *     summary: Actualizar un estado
 *     tags: [Estados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: "Fuera de servicio"
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       404:
 *         description: Estado no encontrado
 */
router.put("/:id", controller.update);

module.exports = router;