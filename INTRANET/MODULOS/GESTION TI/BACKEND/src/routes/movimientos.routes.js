const express = require("express");
const router = express.Router();
const controller = require("../controllers/movimientos.controller");

/**
 * @swagger
 * tags:
 *   name: Movimientos
 *   description: Gestión de movimientos de artículos (historial, asignaciones, cambios de estado)
 */

/**
 * @swagger
 * /movimientos:
 *   get:
 *     summary: Obtener todos los movimientos
 *     tags: [Movimientos]
 *     responses:
 *       200:
 *         description: Lista de movimientos
 *         content:
 *           application/json:
 *             example:
 *               - ID_Movimiento: 1
 *                 Fecha_movimiento: "2026-03-01T10:30:00"
 *                 ID_Estado: 2
 *                 Glosa_Estado: "Asignado"
 *                 Rut_Persona: "12345678-9"
 *                 Nombre_Persona: "Juan Perez"
 *                 ID_Sucursal: 1
 *                 Nombre_Sucursal: "Santiago"
 *                 Serie: "NB-001"
 *                 Responsable: "TI"
 *                 Observacion: "Entrega inicial"
 */
router.get("/", controller.AllMovimientos);

/**
 * @swagger
 * /movimientos:
 *   post:
 *     summary: Crear un movimiento
 *     tags: [Movimientos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             serie: "NB-001"
 *             id_estado: 2
 *             rut_persona: "12345678-9"
 *             id_sucursal: 1
 *             responsable: "TI"
 *             observacion: "Asignación de equipo"
 *     responses:
 *       201:
 *         description: Movimiento creado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/", controller.createMovimiento);

module.exports = router;