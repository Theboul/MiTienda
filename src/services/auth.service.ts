import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../access-data/db';

interface UserRegisterData {
    nombre: string;
    correo: string;
    telefono: string;
    password: string;
    id_rol: number;
}

const SECRET_KEY = process.env.JWT_SECRET;
export const register = async (userData: UserRegisterData) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    try {
        const user = await prisma.usuario.create({
            data: {
                nombre: userData.nombre,
                correo: userData.correo,
                telefono: userData.telefono,
                password: hashedPassword,
                id_rol: userData.id_rol
            },
            select: {
                id_user: true,
                nombre: true,
                correo: true 
            }
        });
        return user;
    }catch (error) {
        throw new Error('Error al registrar el usuario');
    }
}