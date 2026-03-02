import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middlewares globales
app.use(helmet());
app.use(cors());
app.use(express.json()); // ¡Importante para recibir JSON!

// Ruta de prueba
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend MiTienda está vivo' });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Log de prueba para verificar que el servidor arranca correctamente
app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en el puerto ${PORT}`);
});