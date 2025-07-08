-- Script SQL para crear la tabla de agendamientos
-- Ejecutar en phpMyAdmin o directamente en MySQL

CREATE DATABASE IF NOT EXISTS precompra_db;
USE precompra_db;

-- Tabla para almacenar los agendamientos
CREATE TABLE IF NOT EXISTS agendamientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha_agendada DATE NOT NULL,
    bloque VARCHAR(10) NOT NULL,
    horario VARCHAR(10) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    vehiculo VARCHAR(100) NOT NULL,
    año VARCHAR(4) NOT NULL,
    patente VARCHAR(20) DEFAULT NULL,
    observaciones TEXT DEFAULT NULL,
    servicios JSON DEFAULT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices para mejorar rendimiento
    INDEX idx_fecha_bloque (fecha_agendada, bloque),
    INDEX idx_email (email),
    INDEX idx_estado (estado)
);

-- Tabla para las cotizaciones
CREATE TABLE IF NOT EXISTS cotizaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    vehiculo VARCHAR(100) NOT NULL,
    año VARCHAR(4) NOT NULL,
    patente VARCHAR(20) DEFAULT NULL,
    servicios JSON NOT NULL,
    total_estimado DECIMAL(10,2) DEFAULT NULL,
    observaciones TEXT DEFAULT NULL,
    estado VARCHAR(20) DEFAULT 'nueva',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_email (email),
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_creacion)
);

-- Tabla para los pagos/transferencias
CREATE TABLE IF NOT EXISTS pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    agendamiento_id INT NULL,
    cotizacion_id INT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL, -- 'transferencia', 'webpay', etc.
    estado VARCHAR(20) DEFAULT 'pendiente', -- 'pendiente', 'completado', 'fallido'
    token_webpay VARCHAR(100) DEFAULT NULL,
    comprobante_path VARCHAR(255) DEFAULT NULL,
    fecha_pago TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Claves foráneas
    FOREIGN KEY (agendamiento_id) REFERENCES agendamientos(id) ON DELETE SET NULL,
    FOREIGN KEY (cotizacion_id) REFERENCES cotizaciones(id) ON DELETE SET NULL,
    
    -- Índices
    INDEX idx_estado (estado),
    INDEX idx_metodo (metodo_pago),
    INDEX idx_token (token_webpay)
);

-- Insertar algunos datos de ejemplo para pruebas
INSERT INTO agendamientos (fecha_agendada, bloque, horario, nombre, email, telefono, vehiculo, año, servicios) VALUES
('2024-07-15', 'AM', '10:00', 'Juan Pérez', 'juan@example.com', '123456789', 'Toyota Corolla', '2018', '["Revisión técnica", "Cambio de aceite"]'),
('2024-07-16', 'PM', '16:30', 'María González', 'maria@example.com', '987654321', 'Honda Civic', '2020', '["Alineación", "Balanceo"]');

-- Verificar que las tablas se crearon correctamente
SHOW TABLES;
DESCRIBE agendamientos;
DESCRIBE cotizaciones;
DESCRIBE pagos;
