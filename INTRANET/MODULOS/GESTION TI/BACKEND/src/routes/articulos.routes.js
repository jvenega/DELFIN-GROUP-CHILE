const express = require("express");
const router = express.Router();
const controller = require("../controllers/articulos.controller");

/**
 * @swagger
 * tags:
 *   name: Articulos
 *   description: Gestión de artículos
 */

/**
 * @swagger
 * /articulos:
 *   get:
 *     summary: Obtener todos los artículos
 *     tags: [Articulos]
 *     responses:
 *       200:
 *         description: Lista de artículos
 */
router.get("/", controller.getArticulos);

/**
 * @swagger
 * /articulos:
 *   post:
 *     summary: Crear un artículo
 *     tags: [Articulos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             serie: "ABC123"
 *             id_marca: 1
 *             id_modelo: 2
 *             id_tipo: 3
 *             factura: "F123"
 *             valor_unitario: 1000
 *             rut_proveedor: "12345678-9"
 *             fecha_compra: "2026-01-01"
 *             fecha_garantia: "2028-01-01"
 *     responses:
 *       201:
 *         description: Artículo creado
 */
router.post("/", controller.createArticulo);

/**
 * @swagger
 * /articulos/{serie}:
 *   get:
 *     summary: Obtener artículo por serie
 *     tags: [Articulos]
 *     parameters:
 *       - in: path
 *         name: serie
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Artículo encontrado
 *       404:
 *         description: No encontrado
 */
router.get("/:serie", controller.getArticuloBySerie);

/**
 * @swagger
 * /articulos/{serie}:
 *   put:
 *     summary: Actualizar artículo
 *     tags: [Articulos]
 *     parameters:
 *       - in: path
 *         name: serie
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Artículo actualizado
 */
router.put("/:serie", controller.updateArticulo);

module.exports = router;