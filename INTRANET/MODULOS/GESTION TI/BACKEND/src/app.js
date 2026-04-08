const express = require("express");
const { initDB, validateDB } = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const fs = require("fs");
const path = require("path")
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();


// ===== Documentación Swagger =====
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const outputPath = path.join(__dirname, "../openapi.json");

fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

// ===== Configuración CORS =====
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5174",
  "http://localhost:5173",

];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (Postman, curl, backend)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS no permitido"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Aplicar CORS
app.use(cors(corsOptions));

// ===== Middlewares base =====
app.use(express.json());

// ===== Health check =====
app.get("/health", (req, res) => {
  res.status(200).json({
    ok: true,
    service: "api-gestion-ti",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

// ===== Rutas =====
app.use("/api/estados", require("./routes/estados.routes"));
app.use("/api/marcas", require("./routes/marcas.routes"));
app.use("/api/modelos", require("./routes/modelos.routes"));
app.use("/api/proveedores", require("./routes/proveedores.routes"));
app.use("/api/sucursales", require("./routes/sucursales.routes"));
app.use("/api/tipos", require("./routes/tipos.routes"));
app.use("/api/articulos", require("./routes/articulos.routes"));
app.use("/api/movimientos", require("./routes/movimientos.routes"));
app.use("/api/personas", require("./routes/personas.routes"));


// ===== 404 handler =====
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: "Ruta no encontrada",
  });
});

// ===== Error handler global =====
app.use(errorHandler);

// ===== Arranque controlado =====
const PORT = process.env.PORT || 3004;

async function startServer() {
  try {
    await initDB();

    await validateDB({
      requiredSP: [
        "dbo.SP_GA_Estados",
        "dbo.SP_GA_Marcas",
        "dbo.SP_GA_Modelos",
        "dbo.SP_GA_Proveedores",
        "dbo.SP_GA_Sucursales",
        "dbo.SP_GA_Tipos",
        "dbo.SP_GA_PERSONAS"
      ],
    });

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });

  } catch (error) {
    console.error("Error iniciando la aplicación:", error);
    process.exit(1);
  }
}

// ===== Manejo de errores globales =====
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

// ===== Start =====
startServer();