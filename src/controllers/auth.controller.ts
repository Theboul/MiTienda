import { Request, Response } from "express";
import * as authService from "../services/auth.service";

// Registro de nuevo usuario
export const register = async (req: Request, res: Response) => {
    try {
        const { usuario, tienda } = req.body;
        const newUser = await authService.register(usuario, tienda);

        res.status(201).json({
            ok: true,
            message: "Cuenta y Tienda creadas con éxito",
            data: newUser
        });
    }catch (error: any) {
        res.status(400).json({
            ok: false,
            message: error.message || "Error en el registro"
        });
    }
}

// Login de usuario
export const login = async (req: Request, res: Response) => {
    try {
        const { token, user } = await authService.login(req.body);
        res.status(200).json({
            ok: true,
            message: `Bienvenido ${user.nombre}`,
            data: { token, user }
        });
    }catch (error: any) {
        res.status(400).json({
            ok: false,
            message: error.message || "Error al iniciar sesión"
        });
    }
}

// Obtener perfil
export const getProfile = async (req: Request, res: Response) => {
    try {
        // El id viene inyectado desde el middleware authenticateToken
        const userId = (req as any).user.id; 
        
        const userProfile = await authService.getProfile(userId);

        res.status(200).json({
            ok: true,
            message: "Perfil obtenido con éxito",
            data: userProfile
        });
    } catch (error: any) {
        res.status(404).json({
            ok: false,
            message: error.message || "No se encontró el perfil del usuario"
        });
    }
};