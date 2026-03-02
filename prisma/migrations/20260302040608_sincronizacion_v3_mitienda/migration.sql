/*
  Warnings:

  - You are about to drop the column `fecha` on the `compras` table. All the data in the column will be lost.
  - You are about to drop the column `fecha` on the `ventas` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `ventas` table. All the data in the column will be lost.
  - Added the required column `id_proveedor` to the `compras` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_tienda` to the `compras` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_tienda` to the `ventas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metodo_pago` to the `ventas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pago_con` to the `ventas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pago_total` to the `ventas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_pagado` to the `ventas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "compras" DROP COLUMN "fecha",
ADD COLUMN     "fecha_entrega" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id_proveedor" INTEGER NOT NULL,
ADD COLUMN     "id_tienda" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ventas" DROP COLUMN "fecha",
DROP COLUMN "total",
ADD COLUMN     "fecha_venta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id_tienda" INTEGER NOT NULL,
ADD COLUMN     "metodo_pago" TEXT NOT NULL,
ADD COLUMN     "pago_con" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "pago_total" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "total_pagado" DECIMAL(10,2) NOT NULL;

-- CreateTable
CREATE TABLE "tiendas" (
    "id_tienda" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "nit" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tiendas_pkey" PRIMARY KEY ("id_tienda")
);

-- CreateTable
CREATE TABLE "usuarios_tiendas" (
    "id_usuario_tienda" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_tienda" INTEGER NOT NULL,
    "fecha_asignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "es_principal" BOOLEAN NOT NULL DEFAULT false,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "usuarios_tiendas_pkey" PRIMARY KEY ("id_usuario_tienda")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id_categ" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id_categ")
);

-- CreateTable
CREATE TABLE "productos" (
    "id_producto" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "stock_total" INTEGER NOT NULL DEFAULT 0,
    "url_imagen" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "descripcion" TEXT,
    "stock_minimo" INTEGER NOT NULL DEFAULT 5,
    "id_tienda" INTEGER NOT NULL,
    "id_categ" INTEGER NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id_producto")
);

-- CreateTable
CREATE TABLE "productos_ventas" (
    "id_producto_venta" SERIAL NOT NULL,
    "id_venta" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_de_venta" DECIMAL(10,2) NOT NULL,
    "sub_total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "productos_ventas_pkey" PRIMARY KEY ("id_producto_venta")
);

-- CreateTable
CREATE TABLE "proveedores" (
    "id_proveedor" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("id_proveedor")
);

-- CreateTable
CREATE TABLE "productos_compras" (
    "id_producto_compra" SERIAL NOT NULL,
    "id_compra" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "precio_de_compra" DECIMAL(10,2) NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "sub_total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "productos_compras_pkey" PRIMARY KEY ("id_producto_compra")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_tiendas_id_usuario_id_tienda_key" ON "usuarios_tiendas"("id_usuario", "id_tienda");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nombre_key" ON "categorias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "productos_ventas_id_venta_id_producto_key" ON "productos_ventas"("id_venta", "id_producto");

-- CreateIndex
CREATE UNIQUE INDEX "productos_compras_id_compra_id_producto_key" ON "productos_compras"("id_compra", "id_producto");

-- AddForeignKey
ALTER TABLE "usuarios_tiendas" ADD CONSTRAINT "usuarios_tiendas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_tiendas" ADD CONSTRAINT "usuarios_tiendas_id_tienda_fkey" FOREIGN KEY ("id_tienda") REFERENCES "tiendas"("id_tienda") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_id_tienda_fkey" FOREIGN KEY ("id_tienda") REFERENCES "tiendas"("id_tienda") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_id_categ_fkey" FOREIGN KEY ("id_categ") REFERENCES "categorias"("id_categ") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_id_tienda_fkey" FOREIGN KEY ("id_tienda") REFERENCES "tiendas"("id_tienda") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos_ventas" ADD CONSTRAINT "productos_ventas_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "ventas"("id_venta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos_ventas" ADD CONSTRAINT "productos_ventas_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compras" ADD CONSTRAINT "compras_id_tienda_fkey" FOREIGN KEY ("id_tienda") REFERENCES "tiendas"("id_tienda") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compras" ADD CONSTRAINT "compras_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "proveedores"("id_proveedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos_compras" ADD CONSTRAINT "productos_compras_id_compra_fkey" FOREIGN KEY ("id_compra") REFERENCES "compras"("id_compra") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos_compras" ADD CONSTRAINT "productos_compras_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;
