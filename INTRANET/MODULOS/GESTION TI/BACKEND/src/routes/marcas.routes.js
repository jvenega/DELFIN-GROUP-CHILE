const express = require("express");
const router = express.Router();
const controller = require("../controllers/marcas.controller");

/**
 * @swagger
 * tags:
 *   name: Marcas
 *   description: Gestión de marcas de artículos
 */

/**
 * @swagger
 * /marcas:
 *   get:
 *     summary: Obtener todas las marcas
 *     tags: [Marcas]
 *     responses:
 *       200:
 *         description: Lista de marcas
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 nombre: "HP"
 *               - id: 2
 *                 nombre: "Dell"
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /marcas:
 *   post:
 *     summary: Crear una marca
 *     tags: [Marcas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: "Lenovo"
 *     responses:
 *       201:
 *         description: Marca creada correctamente
 */
router.post("/", controller.create);

/**
 * @swagger
 * /marcas/{id}:
 *   put:
 *     summary: Actualizar una marca
 *     tags: [Marcas]
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
 *             nombre: "Asus"
 *     responses:
 *       200:
 *         description: Marca actualizada correctamente
 *       404:
 *         description: Marca no encontrada
 */
router.put("/:id", controller.update);

module.exports = router;