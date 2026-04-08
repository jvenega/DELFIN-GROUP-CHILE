import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { logger } from "./middleware/logger";
import authRoutes from "./routes/auth.routes";
import testRoutes from "./routes/test.routes";

import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import path from 'path';

dotenv.config();

const app = express();

// ===============================
// 🌐 CORS GLOBAL (PRIMERO SIEMPRE)
// ===============================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      // "http://192.168.100.45",
      "http://192.168.100.48",
      "https://192.168.100.48",

      // "https://grupo-delfin.cl"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-session-token"],
    credentials: true,
  })
);

// swagger init
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Login',
    version: '1.0.0',
    description: 'API Login',
  },
  servers: [
    {
      url: 'http://localhost:4000',
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: [
      path.join(__dirname, 'routes/*.[tj]s'),
      path.join(__dirname, 'controllers/*.[tj]s')
    ],
};

const swaggerSpec = swaggerJSDoc(options);

app.get('/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// swagger end

// Express 5 YA maneja OPTIONS automaticamente — NO agregar app.options()

// ===============================
// 🧩 Middlewares
// ===============================
app.use(express.json());
app.use(logger);

// ===============================
// 🚦 Rutas
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);

export default app;
