import { Router } from "express";
import * as auth from "../controllers/auth.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { validateRegister, validateLogin } from "../middlewares/validator.middleware";

const router = Router();

// URL completa: /api/auth/register
router.post("/register", validateRegister, auth.register);
// URL completa: /api/auth/login
router.post("/login", validateLogin, auth.login);
// Esta ruta requiere el token para poder entrar
router.get("/profile", authenticateToken, auth.getProfile);

export default router;