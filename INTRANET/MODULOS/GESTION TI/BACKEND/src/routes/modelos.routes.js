const express = require("express");
const router = express.Router();
const controller = require("../controllers/modelos.controller");

/**
 * @swagger
 * tags:
 *   name: Modelos
 *   description: Gestión de modelos de artículos
 */

/**
 * @swagger
 * /modelos:
 *   get:
 *     summary: Obtener todos los modelos
 *     tags: [Modelos]
 *     responses:
 *       200:
 *         description: Lista de modelos
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 nombre: "EliteBook 840"
 *                 id_marca: 1
 *               - id: 2
 *                 nombre: "Latitude 5420"
 *                 id_marca: 2
 */
router.get("/", controller.getModelos);

/**
 * @swagger
 * /modelos:
 *   post:
 *     summary: Crear un modelo
 *     tags: [Modelos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: "ThinkPad X1"
 *             id_marca: 3
 *     responses:
 *       201:
 *         description: Modelo creado correctamente
 */
router.post("/", controller.createModelo);

/**
 * @swagger
 * /modelos/{id}:
 *   put:
 *     summary: Actualizar un modelo
 *     tags: [Modelos]
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
 *             nombre: "ThinkPad X1 Carbon"
 *             id_marca: 3
 *     responses:
 *       200:
 *         description: Modelo actualizado correctamente
 *       404:
 *         description: Modelo no encontrado
 */
router.put("/:id", controller.updateModelo);

module.exports = router;