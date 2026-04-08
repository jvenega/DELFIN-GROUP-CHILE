import { Router } from "express";
import { getUsers } from "../services/user.service";
import { verifySession } from "../middleware/verifySession";     
import { verifyPermission } from "../middleware/verifyPermission"; 

const router = Router();

// Ruta de prueba: obtiene usuarios de la BD
router.get(
  "/test/users",
  verifySession,
  verifyPermission("ver_usuarios"),
  async (req, res) => {
    try {
      const users = await getUsers();
      res.json({
        message: "Conexión exitosa a la BD",
        data: users
      });
    } catch (error) {
      console.error("Error en /test/users:", error);
      res.status(500).json({ message: "Error al consultar usuarios" });
    }
  }
);

export default router;
