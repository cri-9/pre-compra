<?php
// Script para crear las tablas faltantes en producción
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Cargar configuración de producción
$envPath = __DIR__ . '/.env.production';
if (file_exists($envPath)) {
    $envVars = parse_ini_file($envPath);
    $host = $envVars['DB_HOST'] ?? 'localhost';
    $db   = $envVars['DB_NAME'] ?? 'visualmecanica_prod';
    $user = $envVars['DB_USER'] ?? 'root';
    $pass = $envVars['DB_PASS'] ?? '';
} else {
    die("Archivo .env.production no encontrado");
}

echo "<h2>Configuración de Base de Datos de Producción</h2>";
echo "Host: $host<br>";
echo "Database: $db<br>";
echo "User: $user<br>";
echo "Pass: " . (empty($pass) ? 'vacío' : 'configurado') . "<br><br>";

try {
    // Conectar a MySQL sin especificar base de datos primero
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<h3>✅ Conexión a MySQL exitosa</h3>";
    
    // Crear base de datos si no existe
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "✅ Base de datos '$db' verificada/creada<br>";
    
    // Seleccionar la base de datos
    $pdo->exec("USE `$db`");
    echo "✅ Base de datos '$db' seleccionada<br><br>";
    
    // Verificar tablas existentes
    echo "<h3>Tablas existentes:</h3>";
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    if (empty($tables)) {
        echo "No hay tablas en la base de datos<br>";
    } else {
        foreach ($tables as $table) {
            echo "- $table<br>";
        }
    }
    echo "<br>";
    
    // Crear tabla agendamientos
    echo "<h3>Creando tabla agendamientos...</h3>";
    $createAgendamientos = "
    CREATE TABLE IF NOT EXISTS `agendamientos` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `fecha_agendada` date NOT NULL,
        `bloque` varchar(10) NOT NULL,
        `horario` varchar(10) NOT NULL,
        `nombre_cliente` varchar(100) NOT NULL,
        `apellido_cliente` varchar(100) NOT NULL,
        `email_cliente` varchar(100) NOT NULL,
        `telefono_cliente` varchar(20) NOT NULL,
        `rut_cliente` varchar(20) DEFAULT NULL,
        `direccion_cliente` varchar(255) DEFAULT NULL,
        `region_cliente` varchar(50) DEFAULT NULL,
        `comuna_cliente` varchar(50) DEFAULT NULL,
        `presente_inspeccion` varchar(10) DEFAULT NULL,
        `tipo_vendedor` varchar(50) DEFAULT NULL,
        `nombre_vendedor` varchar(100) DEFAULT NULL,
        `telefono_vendedor` varchar(20) DEFAULT NULL,
        `direccion_vendedor` varchar(255) DEFAULT NULL,
        `region_vendedor` varchar(50) DEFAULT NULL,
        `comuna_vendedor` varchar(50) DEFAULT NULL,
        `marca_vehiculo` varchar(100) NOT NULL,
        `modelo_vehiculo` varchar(100) NOT NULL,
        `anio_vehiculo` varchar(4) NOT NULL,
        `patente` varchar(20) DEFAULT NULL,
        `observaciones` text DEFAULT NULL,
        `servicios_seleccionados` json DEFAULT NULL,
        `servicio_id` int(11) DEFAULT NULL,
        `nombre_servicio` varchar(100) DEFAULT NULL,
        `monto_total` decimal(10,2) DEFAULT NULL,
        `estado` varchar(20) DEFAULT 'pendiente',
        `metodo_pago` varchar(50) DEFAULT NULL,
        `estado_pago` varchar(20) DEFAULT 'pendiente',
        `token_webpay` varchar(100) DEFAULT NULL,
        `comprobante_transferencia` varchar(255) DEFAULT NULL,
        `fecha_pago` timestamp NULL DEFAULT NULL,
        `fecha_creacion` timestamp DEFAULT CURRENT_TIMESTAMP,
        `fecha_actualizacion` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        KEY `idx_fecha_bloque` (`fecha_agendada`,`bloque`),
        KEY `idx_email` (`email_cliente`),
        KEY `idx_estado` (`estado`),
        KEY `idx_estado_pago` (`estado_pago`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $pdo->exec($createAgendamientos);
    echo "✅ Tabla 'agendamientos' creada exitosamente<br>";
    
    // Crear tabla cotizaciones
    echo "<h3>Creando tabla cotizaciones...</h3>";
    $createCotizaciones = "
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $pdo->exec($createCotizaciones);
    echo "✅ Tabla 'cotizaciones' creada exitosamente<br>";
    
    // Crear tabla pagos
    echo "<h3>Creando tabla pagos...</h3>";
    $createPagos = "
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
        KEY `fk_cotizacion` (`cotizacion_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $pdo->exec($createPagos);
    echo "✅ Tabla 'pagos' creada exitosamente<br>";
    
    // Verificar tablas creadas
    echo "<h3>Verificando tablas creadas:</h3>";
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    foreach ($tables as $table) {
        echo "✅ $table<br>";
    }
    
    // Verificar estructura de la tabla agendamientos
    echo "<h3>Estructura de la tabla agendamientos:</h3>";
    $stmt = $pdo->query("DESCRIBE agendamientos");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "<table border='1' style='border-collapse: collapse;'>";
    echo "<tr><th>Campo</th><th>Tipo</th><th>Nulo</th><th>Clave</th><th>Por defecto</th></tr>";
    foreach ($columns as $column) {
        echo "<tr>";
        echo "<td>{$column['Field']}</td>";
        echo "<td>{$column['Type']}</td>";
        echo "<td>{$column['Null']}</td>";
        echo "<td>{$column['Key']}</td>";
        echo "<td>{$column['Default']}</td>";
        echo "</tr>";
    }
    echo "</table>";
    
    echo "<br><h2>🎉 ¡Configuración de base de datos completada exitosamente!</h2>";
    
} catch (PDOException $e) {
    echo "<h3>❌ Error de conexión:</h3>";
    echo "Error: " . $e->getMessage() . "<br>";
    echo "Código: " . $e->getCode() . "<br>";
}
?>