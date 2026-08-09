import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token){
        return res.status(403).json({ ok: false, error: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY!) as any;
        (req as any).user = {
            id: decoded.id,
            rol: decoded.rol,
            tienda: decoded.id_tienda
        };
        next();
    } catch (error) {
        return res.status(403).json({ ok: false, error: 'Token inválido o expirado' });
    }
}