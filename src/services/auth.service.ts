
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../access-data/db';
import { includes } from 'zod';

interface UserRegisterData {
    nombre: string;
    correo: string;
    telefono: string;
    password: string;
    id_rol: number;
}

interface StoreRegisterData {
    nombre_tienda: string;
    direccion: string;
    nit: string;
}

// La interfaz es para definir los tipos de datos que se esperan al registrar/Logear un usuario.
// Registro de nuevo usuario

const SECRET_KEY = process.env.JWT_SECRET;
export const register = async (userData: UserRegisterData, storeData: StoreRegisterData) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    try {
        const result = await prisma.$transaction(async (tx) => {
            const tienda = await tx.tienda.create({
                data: {
                    nombre: storeData.nombre_tienda,
                    direccion: storeData.direccion,
                    nit: storeData.nit
                }
            });

            const user = await tx.usuario.create({
                data:{
                    nombre: userData.nombre,
                    correo: userData.correo,
                    telefono: userData.telefono,
                    password: hashedPassword,
                    id_rol: userData.id_rol
                }
            });

            await tx.usuarioTienda.create({
                data: {
                    id_usuario: user.id_user,
                    id_tienda: tienda.id_tienda,
                    es_principal: true,
                    estado: "ACTIVO"
                }
            });

            return { user, tienda };
        });

        return {
            id: result.user.id_user,
            nombre: result.user.nombre,
            tienda: result.tienda.nombre
        };

    }catch (error: any) {
        console.error(error);
        if (error.code === 'P2002') throw new Error('El correo o el NIT ya están registrados');
        throw new Error('Error al registrar el sistema de la tienda');
    }
}


// Login de usuario
interface LoginData {
    correo: string;
    password: string;
}

export const login = async (loginData: LoginData) => {
    try {
        const user = await prisma.usuario.findUnique({
            where: { correo: loginData.correo },
            include: {rol: true,
                    tiendas:{
                        include: { tienda: true }
                    }
        }});

        if (!user) {
            throw new Error('Correo o contraseña incorrectos');
        }
        const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Correo o contraseña incorrectos');
        }

        const tiendaPrincipal = user.tiendas.find(t => t.es_principal)?.id_tienda;

        const token = jwt.sign({ id: user.id_user, rol: user.rol.nombre, tienda: tiendaPrincipal }, SECRET_KEY!, { expiresIn: '12h' });
        return { token, user:{
                        id: user.id_user,
                        nombre: user.nombre,
                        correo: user.correo,
                        rol: user.rol.nombre,
                        tiendas: user.tiendas.map(t => t.id_tienda)
                        }
                };
                
    }catch (error: any) {
        throw new Error(error.message || 'Error al iniciar sesión');
    }
}


// Recordar Sesion
// Obtener perfil de usuario (Gurda el id del usuario en el token y lo usa para obtener su perfil)

export const getProfile = async (userId: number) => {
    try {
        const user = await prisma.usuario.findUnique({
            where: { id_user: userId },
            select: {
                id_user: true,
                nombre: true,
                correo: true,
                rol: {
                    select: { nombre: true }
                }
            }
        });

        if (!user) throw new Error('Usuario no encontrado');
        return user;
    } catch (error) {
        throw new Error('Error al obtener el perfil');
    }
};