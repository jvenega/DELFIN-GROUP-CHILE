const express = require("express");
const router = express.Router();
const controller = require("../controllers/tipos.controller");

/**
 * @swagger
 * tags:
 *   name: Tipos
 *   description: Gestión de tipos de artículos (categorías)
 */

/**
 * @swagger
 * /tipos:
 *   get:
 *     summary: Obtener todos los tipos
 *     tags: [Tipos]
 *     responses:
 *       200:
 *         description: Lista de tipos
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 nombre: "Notebook"
 *               - id: 2
 *                 nombre: "Monitor"
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /tipos:
 *   post:
 *     summary: Crear un tipo
 *     tags: [Tipos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: "Teclado"
 *     responses:
 *       201:
 *         description: Tipo creado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/", controller.create);

/**
 * @swagger
 * /tipos/{id}:
 *   put:
 *     summary: Actualizar un tipo
 *     tags: [Tipos]
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
 *             nombre: "Periférico"
 *     responses:
 *       200:
 *         description: Tipo actualizado correctamente
 *       404:
 *         description: Tipo no encontrado
 */
router.put("/:id", controller.update);

module.exports = router;