<?php
/**
 * Script para verificar el estado de la base de datos de producción
 * Verifica que todas las tablas necesarias existan y estén funcionando
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
    
    echo "🔍 Verificando base de datos de producción...\n\n";
    
    // Conexión a la base de datos
    $conn = new mysqli($host, $user, $pass, $db);
    if ($conn->connect_error) {
        throw new Exception('Error de conexión: ' . $conn->connect_error);
    }
    
    echo "✅ Conexión exitosa a la base de datos: $db\n\n";
    
    // Verificar tablas necesarias
    $tablasNecesarias = ['agendamientos', 'cotizaciones', 'pagos'];
    $resultados = [];
    
    foreach ($tablasNecesarias as $tabla) {
        echo "📋 Verificando tabla: $tabla\n";
        
        // Verificar si existe
        $result = $conn->query("SHOW TABLES LIKE '$tabla'");
        $existe = $result->num_rows > 0;
        
        if ($existe) {
            echo "  ✅ Tabla existe\n";
            
            // Contar registros
            $result = $conn->query("SELECT COUNT(*) as total FROM $tabla");
            $row = $result->fetch_assoc();
            $totalRegistros = $row['total'];
            echo "  📊 Total de registros: $totalRegistros\n";
            
            // Obtener estructura
            $result = $conn->query("DESCRIBE $tabla");
            $columnas = [];
            while ($row = $result->fetch_assoc()) {
                $columnas[] = $row['Field'];
            }
            echo "  🏗️  Columnas: " . implode(', ', $columnas) . "\n";
            
            $resultados[$tabla] = [
                'existe' => true,
                'registros' => $totalRegistros,
                'columnas' => $columnas
            ];
            
        } else {
            echo "  ❌ Tabla NO existe\n";
            $resultados[$tabla] = [
                'existe' => false,
                'registros' => 0,
                'columnas' => []
            ];
        }
        echo "\n";
    }
    
    // Probar consulta específica que estaba fallando
    echo "🧪 Probando consulta de verificación de bloques...\n";
    
    if ($resultados['agendamientos']['existe']) {
        $fechaPrueba = '2024-07-15';
        $stmt = $conn->prepare("SELECT bloque FROM agendamientos WHERE fecha_agendada = ?");
        $stmt->bind_param("s", $fechaPrueba);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $bloquesOcupados = [];
        while ($row = $result->fetch_assoc()) {
            $bloquesOcupados[] = $row['bloque'];
        }
        
        echo "  ✅ Consulta ejecutada exitosamente\n";
        echo "  📅 Fecha de prueba: $fechaPrueba\n";
        echo "  🚫 Bloques ocupados: " . (empty($bloquesOcupados) ? 'Ninguno' : implode(', ', $bloquesOcupados)) . "\n";
        
        $todosLosBloques = ["AM", "PM"];
        $disponibles = array_values(array_diff($todosLosBloques, $bloquesOcupados));
        echo "  ✅ Bloques disponibles: " . implode(', ', $disponibles) . "\n";
        
        $stmt->close();
    } else {
        echo "  ❌ No se puede probar la consulta porque la tabla agendamientos no existe\n";
    }
    
    echo "\n";
    
    // Resumen final
    $todasExisten = true;
    foreach ($resultados as $tabla => $info) {
        if (!$info['existe']) {
            $todasExisten = false;
            break;
        }
    }
    
    if ($todasExisten) {
        echo "🎉 ¡ÉXITO! Todas las tablas necesarias existen y funcionan correctamente.\n";
        echo "La aplicación debería funcionar sin problemas en producción.\n";
    } else {
        echo "⚠️  ADVERTENCIA: Algunas tablas no existen.\n";
        echo "Ejecuta el script fix_production_database.php o el archivo create_production_tables.sql\n";
    }
    
    $conn->close();
    
    // Respuesta JSON
    echo "\n" . json_encode([
        'success' => $todasExisten,
        'database' => $db,
        'tablas' => $resultados,
        'message' => $todasExisten ? 'Todas las tablas existen y funcionan' : 'Algunas tablas faltan'
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>