const express = require("express");
const router = express.Router();
const controller = require("../controllers/personas.controller");

/**
 * @swagger
 * tags:
 *   name: Personas
 *   description: Gestión de personas (usuarios/responsables de artículos)
 */

/**
 * @swagger
 * /personas/{rut}:
 *   get:
 *     summary: Obtener persona por RUT
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: rut
 *         required: true
 *         schema:
 *           type: string
 *         example: "12345678-9"
 *     responses:
 *       200:
 *         description: Persona encontrada
 *         content:
 *           application/json:
 *             example:
 *               rut: "12345678-9"
 *               nombre: "Juan Perez"
 *               correo: "juan@empresa.cl"
 *       404:
 *         description: Persona no encontrada
 */
router.get("/:rut", controller.getPersona);

/**
 * @swagger
 * /personas:
 *   post:
 *     summary: Crear o actualizar persona (UPSERT)
 *     tags: [Personas]
 *     description: Si el RUT existe, actualiza; si no, crea un nuevo registro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             rut: "12345678-9"
 *             nombre: "Juan Perez"
 *             correo: "juan@empresa.cl"
 *     responses:
 *       200:
 *         description: Persona creada o actualizada correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/", controller.upsertPersona);

module.exports = router;