<?php
// Prueba simple de base de datos
header('Content-Type: application/json');

// Configurar cabeceras CORS automáticamente
require_once 'helpers/corsHeaders.php';
setCorsHeaders();

try {
    // Conexión usando variables de entorno
    require_once 'conexionBD.php';
    $conn = new mysqli($host, $user, $pass, $db);
    
    if ($conn->connect_error) {
        throw new Exception("Error de conexión a MySQL: " . $conn->connect_error);
    }
    
    // Verificar si la tabla agendamientos existe
    $result = $conn->query("SHOW TABLES LIKE 'agendamientos'");
    if ($result->num_rows > 0) {
        // La tabla existe, verificar su estructura
        $columns = [];
        $result = $conn->query("DESCRIBE agendamientos");
        while ($row = $result->fetch_assoc()) {
            $columns[] = $row['Field'];
        }
        
        // Contar registros
        $result = $conn->query("SELECT COUNT(*) as total FROM agendamientos");
        $row = $result->fetch_assoc();
        $totalRegistros = $row['total'];
        
        echo json_encode([
            'success' => true,
            'message' => 'Base de datos y tabla ya existen',
            'database' => 'precompra_db',
            'table' => 'agendamientos',
            'columns' => $columns,
            'total_records' => $totalRegistros,
            'structure' => 'Tabla existente con estructura completa'
        ]);
    } else {
        // La tabla no existe, crear con la estructura completa que ya tienes
        $sql = "CREATE TABLE `agendamientos` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `marca_vehiculo` varchar(100) DEFAULT NULL COMMENT 'Marca del Vehículo',
            `modelo_vehiculo` varchar(100) DEFAULT NULL COMMENT 'Modelo del Vehículo',
            `anio_vehiculo` varchar(10) DEFAULT NULL COMMENT 'Año del Vehículo',
            `patente` varchar(20) DEFAULT NULL COMMENT 'Patente del Vehículo',
            `nombre_cliente` varchar(100) DEFAULT NULL,
            `apellido_cliente` varchar(100) DEFAULT NULL,
            `email_cliente` varchar(100) DEFAULT NULL,
            `telefono_cliente` varchar(20) DEFAULT NULL,
            `rut_cliente` varchar(20) DEFAULT NULL,
            `direccion_cliente` varchar(255) DEFAULT NULL,
            `region_cliente` varchar(100) DEFAULT NULL,
            `comuna_cliente` varchar(100) DEFAULT NULL,
            `tipo_vendedor` varchar(50) DEFAULT NULL,
            `nombre_vendedor` varchar(100) DEFAULT NULL,
            `telefono_vendedor` varchar(20) DEFAULT NULL,
            `direccion_vendedor` varchar(255) DEFAULT NULL,
            `region_vendedor` varchar(100) DEFAULT NULL,
            `comuna_vendedor` varchar(100) DEFAULT NULL,
            `fecha_agendada` date DEFAULT NULL,
            `bloque` varchar(50) DEFAULT NULL,
            `metodo_pago` varchar(50) DEFAULT NULL,
            `fecha_creacion` datetime DEFAULT current_timestamp(),
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode([
                'success' => true,
                'message' => 'Tabla agendamientos creada con estructura completa',
                'database' => 'precompra_db',
                'table' => 'agendamientos'
            ]);
        } else {
            throw new Exception("Error creando tabla: " . $conn->error);
        }
    }
    
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
