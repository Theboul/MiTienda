import { Request, Response, NextFunction } from "express";

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
    const { usuario, tienda } = req.body;

    if (!usuario.nombre || usuario.nombre.trim().length < 3) {
        return res.status(400).json({ ok: false, message: 'El nombre es demasiado corto' });
    }

    if (usuario.nombre.length > 50) {
        return res.status(400).json({ ok: false, message: 'El nombre es demasiado largo' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!usuario.correo || !emailRegex.test(usuario.correo)) {
        return res.status(400).json({ ok: false, message: 'El formato del correo no es válido' });
    }

    const phoneRegex = /^\d{8}$/;
    if (!usuario.telefono || !phoneRegex.test(usuario.telefono)) {
        return res.status(400).json({ ok: false, message: 'El formato del teléfono no es válido' });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!usuario.password || !passwordRegex.test(usuario.password)) {
        return res.status(400).json({ ok: false,
            message: 'La contraseña debe tener al menos 8 caracteres, incluyendo letras y números'
        });
    }

    // --- VALIDACIÓN DE LA TIENDA ---
    if (!tienda?.nombre_tienda || tienda.nombre_tienda.trim().length < 3) {
        return res.status(400).json({ ok: false, message: 'El nombre de la tienda es obligatorio' });
    }

    if (!tienda?.direccion || tienda.direccion.trim().length < 5) {
        return res.status(400).json({ ok: false, message: 'La dirección de la tienda es obligatoria' });
    }

    if (!tienda?.nit || tienda.nit.trim().length < 7) {
        return res.status(400).json({ ok: false, message: 'El NIT proporcionado no es válido' });
    }

    next();
}

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    const { correo, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!correo || !emailRegex.test(correo)) {
        return res.status(400).json({ ok: false, message: 'Por favor, ingresa un correo válido' });
    }

    if (!password) {
        return res.status(400).json({ ok: false, message: 'La contraseña es obligatoria' });
    }

    next();
}