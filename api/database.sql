-- Comando para crear la base de datos si no existe previamente
CREATE DATABASE IF NOT EXISTS crece_cole;
-- Indica al sistema que utilice la base de datos 'crece_cole' para las siguientes operaciones
USE crece_cole;

-- Inicia la creación de la tabla 'usuarios' si no existe
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Columna ID: entero, autoincrementable y llave primaria
    nombre VARCHAR(100) NOT NULL, -- Columna nombre: texto de hasta 100 caracteres, obligatorio
    email VARCHAR(100) NOT NULL UNIQUE, -- Columna email: texto de hasta 100 caracteres, obligatorio y único
    password VARCHAR(255) NOT NULL, -- Columna password: texto de hasta 255 caracteres para el hash, obligatorio
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Columna fecha: se llena automáticamente con la fecha actual
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; -- Define el motor de almacenamiento InnoDB y soporte para caracteres especiales


