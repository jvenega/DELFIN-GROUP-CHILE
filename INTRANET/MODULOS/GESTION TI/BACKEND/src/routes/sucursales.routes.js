const express = require("express");
const router = express.Router();
const controller = require("../controllers/sucursales.controller");

/**
 * @swagger
 * tags:
 *   name: Sucursales
 *   description: Gestión de sucursales
 */

/**
 * @swagger
 * /sucursales:
 *   get:
 *     summary: Obtener todas las sucursales
 *     tags: [Sucursales]
 *     responses:
 *       200:
 *         description: Lista de sucursales
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 nombre: "Santiago"
 *                 descripcion: "Casa matriz"
 *               - id: 2
 *                 nombre: "Valparaíso"
 *                 descripcion: "Sucursal regional"
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /sucursales:
 *   post:
 *     summary: Crear una sucursal
 *     tags: [Sucursales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: "Concepción"
 *             descripcion: "Sucursal sur"
 *     responses:
 *       201:
 *         description: Sucursal creada correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/", controller.create);

/**
 * @swagger
 * /sucursales/{id}:
 *   put:
 *     summary: Actualizar una sucursal
 *     tags: [Sucursales]
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
 *             nombre: "Santiago Centro"
 *             descripcion: "Casa matriz actualizada"
 *     responses:
 *       200:
 *         description: Sucursal actualizada correctamente
 *       404:
 *         description: Sucursal no encontrada
 */
router.put("/:id", controller.update);

module.exports = router;