<?php
/**
 * Script para crear la tabla agendamientos en la base de datos de producción
 * Este script debe ejecutarse una sola vez para solucionar el error de tabla faltante
 */

header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    // Configuración de producción
    $host = 'database';  // nombre del servicio en docker-compose.prod.yml
    $db = 'visualmecanica_prod';
    $user = 'visualmecanica_user';
    $pass = 'password_seguro_123';
    
    echo "Conectando a la base de datos de producción...\n";
    
    // Conexión a la base de datos
    $conn = new mysqli($host, $user, $pass, $db);
    if ($conn->connect_error) {
        throw new Exception('Error de conexión: ' . $conn->connect_error);
    }
    
    echo "Conexión exitosa a la base de datos: $db\n";
    
    // Verificar si la tabla agendamientos existe
    $result = $conn->query("SHOW TABLES LIKE 'agendamientos'");
    
    if ($result->num_rows > 0) {
        echo "La tabla 'agendamientos' ya existe en la base de datos.\n";
        
        // Mostrar estructura actual
        $result = $conn->query("DESCRIBE agendamientos");
        echo "Estructura actual de la tabla:\n";
        while ($row = $result->fetch_assoc()) {
            echo "- {$row['Field']}: {$row['Type']}\n";
        }
        
        // Contar registros
        $result = $conn->query("SELECT COUNT(*) as total FROM agendamientos");
        $row = $result->fetch_assoc();
        echo "Total de registros: {$row['total']}\n";
        
    } else {
        echo "La tabla 'agendamientos' NO existe. Creando tabla...\n";
        
        // SQL para crear la tabla agendamientos
        $sql = "CREATE TABLE `agendamientos` (
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        if ($conn->query($sql) === TRUE) {
            echo "Tabla 'agendamientos' creada exitosamente.\n";
            
            // Insertar algunos datos de ejemplo para pruebas
            $insertSql = "INSERT INTO agendamientos (
                fecha_agendada, bloque, horario, nombre_cliente, apellido_cliente, 
                email_cliente, telefono_cliente, marca_vehiculo, modelo_vehiculo, 
                anio_vehiculo, servicios_seleccionados
            ) VALUES 
            ('2024-07-15', 'AM', '10:00', 'Juan', 'Pérez', 'juan@example.com', '123456789', 'Toyota', 'Corolla', '2018', '[\"Revisión técnica\", \"Cambio de aceite\"]'),
            ('2024-07-16', 'PM', '16:30', 'María', 'González', 'maria@example.com', '987654321', 'Honda', 'Civic', '2020', '[\"Alineación\", \"Balanceo\"]')";
            
            if ($conn->query($insertSql) === TRUE) {
                echo "Datos de ejemplo insertados exitosamente.\n";
            } else {
                echo "Error al insertar datos de ejemplo: " . $conn->error . "\n";
            }
            
        } else {
            throw new Exception("Error al crear la tabla: " . $conn->error);
        }
    }
    
    // Verificar también otras tablas necesarias
    echo "\nVerificando otras tablas necesarias...\n";
    
    $tablasNecesarias = ['cotizaciones', 'pagos'];
    
    foreach ($tablasNecesarias as $tabla) {
        $result = $conn->query("SHOW TABLES LIKE '$tabla'");
        if ($result->num_rows > 0) {
            echo "✓ Tabla '$tabla' existe\n";
        } else {
            echo "✗ Tabla '$tabla' NO existe\n";
            
            if ($tabla === 'cotizaciones') {
                $sqlCotizaciones = "CREATE TABLE `cotizaciones` (
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
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
                
                if ($conn->query($sqlCotizaciones) === TRUE) {
                    echo "  → Tabla 'cotizaciones' creada exitosamente\n";
                } else {
                    echo "  → Error al crear tabla 'cotizaciones': " . $conn->error . "\n";
                }
            }
            
            if ($tabla === 'pagos') {
                $sqlPagos = "CREATE TABLE `pagos` (
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
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
                
                if ($conn->query($sqlPagos) === TRUE) {
                    echo "  → Tabla 'pagos' creada exitosamente\n";
                } else {
                    echo "  → Error al crear tabla 'pagos': " . $conn->error . "\n";
                }
            }
        }
    }
    
    echo "\n✅ Proceso completado exitosamente.\n";
    echo "La base de datos de producción ahora tiene todas las tablas necesarias.\n";
    
    $conn->close();
    
    // Respuesta JSON para uso programático
    echo json_encode([
        'success' => true,
        'message' => 'Base de datos de producción configurada correctamente',
        'database' => $db,
        'tables_verified' => ['agendamientos', 'cotizaciones', 'pagos']
    ]);
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>