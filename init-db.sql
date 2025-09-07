-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS visualmecanica_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario si no existe
CREATE USER IF NOT EXISTS 'visualmecanica_user'@'%' IDENTIFIED BY 'password_seguro_123';

-- Otorgar permisos
GRANT ALL PRIVILEGES ON visualmecanica_prod.* TO 'visualmecanica_user'@'%';

-- Aplicar cambios
FLUSH PRIVILEGES;

-- Usar la base de datos
USE visualmecanica_prod;

-- Crear tabla de ejemplo (puedes agregar más tablas según necesites)
CREATE TABLE IF NOT EXISTS test_connection (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de prueba
INSERT INTO test_connection (message) VALUES ('Database connection successful');

--