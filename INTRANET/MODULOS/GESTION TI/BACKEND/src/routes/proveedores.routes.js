const express = require("express");
const router = express.Router();
const controller = require("../controllers/proveedores.controller");

/**
 * @swagger
 * tags:
 *   name: Proveedores
 *   description: Gestión de proveedores
 */

/**
 * @swagger
 * /proveedores:
 *   get:
 *     summary: Obtener todos los proveedores
 *     tags: [Proveedores]
 *     responses:
 *       200:
 *         description: Lista de proveedores
 *         content:
 *           application/json:
 *             example:
 *               - rut: "76123456-7"
 *                 nombre: "Proveedor SPA"
 *                 contacto: "Juan Perez"
 *               - rut: "76987654-3"
 *                 nombre: "Servicios TI Ltda"
 *                 contacto: "Maria Lopez"
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /proveedores:
 *   post:
 *     summary: Crear un proveedor
 *     tags: [Proveedores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             rut: "76123456-7"
 *             nombre: "Proveedor SPA"
 *             contacto: "Juan Perez"
 *     responses:
 *       201:
 *         description: Proveedor creado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/", controller.create);

/**
 * @swagger
 * /proveedores/{rut}:
 *   put:
 *     summary: Actualizar un proveedor
 *     tags: [Proveedores]
 *     parameters:
 *       - in: path
 *         name: rut
 *         required: true
 *         schema:
 *           type: string
 *         example: "76123456-7"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: "Proveedor SPA Actualizado"
 *             contacto: "Pedro Soto"
 *     responses:
 *       200:
 *         description: Proveedor actualizado correctamente
 *       404:
 *         description: Proveedor no encontrado
 */
router.put("/:rut", controller.update);

module.exports = router;