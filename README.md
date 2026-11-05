# MiTienda API

Proyecto de API REST construido con Express, TypeScript y Prisma.

## Descripción
Esta aplicación proporciona una API robusta para gestionar las operaciones de "MiTienda". Utiliza PostgreSQL como base de datos y Prisma como ORM.

## Requisitos Previos
- Node.js (v18 o superior recomendado)
- PostgreSQL
- npm o yarn

## Instalación

1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura tus variables de entorno creando un archivo `.env` en la raíz (puedes basarte en la estructura requerida por Prisma).

## Comandos Disponibles

- `npm run dev`: Inicia el servidor en modo desarrollo con recarga automática.
- `npm run build`: Compila el proyecto de TypeScript a JavaScript.
- `npm start`: Inicia el servidor compilado (requiere ejecutar `npm run build` previamente).

## Estructura del Proyecto

- `src/`: Código fuente de la aplicación.
  - `access-data/`: Configuración y cliente de Prisma/base de datos.
  - `middlewares/`: Middlewares personalizados (auth, validación).
  - `modules/`: Lógica de negocio organizada por módulos (ej. `auth`).
  - `utils/`: Utilidades transversales.
- `prisma/`: Esquemas y configuraciones de la base de datos.
