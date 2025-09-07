-- Script SQL para crear las tablas faltantes en la base de datos de producción
-- Base de datos: visualmecanica_prod
-- Ejecutar este script en phpMyAdmin o directamente en MySQL

USE visualmecanica_prod;

-- Crear tabla agendamientos si no existe
CREATE TABLE IF NOT EXISTS `agendamientos` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `fecha_agendada` date NOT NULL,
    `bloque` varchar(10) NOT NULL,
    `horario` varchar(10) NOT NULL,
    `nombre_cliente` varchar(100) NOT NULL,
    `apellido_cliente` varchar(100) NOT NULL,
    `email_cliente` varchar(100) NOT NULL,
    `telefono_cliente` varchar(20) NOT NULL,
    `marca_vehiculo` varchar(100) NOT NULL,
    `modelo_vehiculo` varchar(100) NOT NULL,
    `anio_vehiculo` varchar(4) NOT NULL,
    `patente` varchar(20) DEFAULT NULL,
    `observaciones` text DEFAULT NULL,
    `servicios_seleccionados` json DEFAULT NULL,
    `estado` varchar(20) DEFAULT 'pendiente',
    `fecha_creacion` timestamp DEFAULT CURRENT_TIMESTAMP,
    `fecha_actualizacion` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `monto_total` decimal(10,2) DEFAULT NULL,
    `metodo_pago` varchar(50) DEFAULT NULL,
    `estado_pago` varchar(20) DEFAULT 'pendiente',
    `token_webpay` varchar(100) DEFAULT NULL,
    `comprobante_transferencia` varchar(255) DEFAULT NULL,
    `fecha_pago` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_fecha_bloque` (`fecha_agendada`,`bloque`),
    KEY `idx_email` (`email_cliente`),
    KEY `idx_estado` (`estado`),
    KEY `idx_estado_pago` (`estado_pago`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla cotizaciones si no existe
CREATE TABLE IF NOT EXISTS `cotizaciones` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `nombre` varchar(100) NOT NULL,
    `email` varchar(100) NOT NULL,
    `telefono` varchar(20) NOT NULL,
    `vehiculo` varchar(100) NOT NULL,
    `año` varchar(4) NOT NULL,
    `patente` varchar(20) DEFAULT NULL,
    `servicios` json NOT NULL,
    `total_estimado` decimal(10,2) DEFAULT NULL,
    `observaciones` text DEFAULT NULL,
    `estado` varchar(20) DEFAULT 'nueva',
    `fecha_creacion` timestamp DEFAULT CURRENT_TIMESTAMP,
    `fecha_actualizacion` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_email` (`email`),
    KEY `idx_estado` (`estado`),
    KEY `idx_fecha` (`fecha_creacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla pagos si no existe
CREATE TABLE IF NOT EXISTS `pagos` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `agendamiento_id` int(11) DEFAULT NULL,
    `cotizacion_id` int(11) DEFAULT NULL,
    `monto` decimal(10,2) NOT NULL,
    `metodo_pago` varchar(50) NOT NULL,
    `estado` varchar(20) DEFAULT 'pendiente',
    `token_webpay` varchar(100) DEFAULT NULL,
    `comprobante_path` varchar(255) DEFAULT NULL,
    `fecha_pago` timestamp NULL DEFAULT NULL,
    `fecha_creacion` timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_estado` (`estado`),
    KEY `idx_metodo` (`metodo_pago`),
    KEY `idx_token` (`token_webpay`),
    KEY `fk_agendamiento` (`agendamiento_id`),
    KEY `fk_cotizacion` (`cotizacion_id`),
    CONSTRAINT `fk_agendamiento` FOREIGN KEY (`agendamiento_id`) REFERENCES `agendamientos` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_cotizacion` FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar algunos datos de ejemplo para pruebas (opcional)
INSERT IGNORE INTO agendamientos (
    fecha_agendada, bloque, horario, nombre_cliente, apellido_cliente, 
    email_cliente, telefono_cliente, marca_vehiculo, modelo_vehiculo, 
    anio_vehiculo, servicios_seleccionados
) VALUES 
('2024-07-15', 'AM', '10:00', 'Juan', 'Pérez', 'juan@example.com', '123456789', 'Toyota', 'Corolla', '2018', '["Revisión técnica", "Cambio de aceite"]'),
('2024-07-16', 'PM', '16:30', 'María', 'González', 'maria@example.com', '987654321', 'Honda', 'Civic', '2020', '["Alineación", "Balanceo"]');

-- Verificar que las tablas se crearon correctamente
SHOW TABLES;

-- Mostrar estructura de las tablas
DESCRIBE agendamientos;
DESCRIBE cotizaciones;
DESCRIBE pagos;

-- Contar registros en cada tabla
SELECT 'agendamientos' as tabla, COUNT(*) as registros FROM agendamientos
UNION ALL
SELECT 'cotizaciones' as tabla, COUNT(*) as registros FROM cotizaciones
UNION ALL
SELECT 'pagos' as tabla, COUNT(*) as registros FROM pagos;