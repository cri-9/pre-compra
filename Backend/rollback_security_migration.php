<?php
/**
 * 🔒 SCRIPT DE ROLLBACK DE MIGRACIÓN DE SEGURIDAD
 * 
 * Script para revertir la migración de seguridad en caso de problemas.
 * 
 * Este script:
 * 1. Busca el directorio de backup más reciente
 * 2. Restaura los archivos originales
 * 3. Verifica que la restauración sea exitosa
 * 
 * Versión: 1.0
 * Fecha: 8 de septiembre de 2025
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

class SecurityRollback {
    private $backupDir;
    private $files = [
        'notificarTransferencia.php',
        'enviarAgendamiento.php',
        'enviarCotizacion.php'
    ];

    public function __construct($backupDir = null) {
        if ($backupDir) {
            $this->backupDir = $backupDir;
        } else {
            $this->backupDir = $this->findLatestBackup();
        }
    }

    public function run() {
        echo "🔄 INICIANDO ROLLBACK DE MIGRACIÓN DE SEGURIDAD\n";
        echo "===============================================\n\n";

        try {
            $this->validateBackup();
            $this->performRollback();
            $this->verifyRollback();
            
            echo "\n✅ ROLLBACK COMPLETADO EXITOSAMENTE\n";
            echo "📁 Backup utilizado: {$this->backupDir}\n";
            
        } catch (Exception $e) {
            echo "\n❌ ERROR EN ROLLBACK: " . $e->getMessage() . "\n";
        }
    }

    private function findLatestBackup() {
        $pattern = __DIR__ . '/backup_migration_*';
        $backups = glob($pattern);
        
        if (empty($backups)) {
            throw new Exception("No se encontraron directorios de backup");
        }
        
        // Ordenar por fecha (más reciente primero)
        usort($backups, function($a, $b) {
            return filemtime($b) - filemtime($a);
        });
        
        return $backups[0];
    }

    private function validateBackup() {
        if (!is_dir($this->backupDir)) {
            throw new Exception("Directorio de backup no existe: {$this->backupDir}");
        }
        
        echo "📁 Usando backup: {$this->backupDir}\n";
        
        $foundFiles = 0;
        foreach ($this->files as $file) {
            $backupPath = $this->backupDir . '/' . $file;
            if (file_exists($backupPath)) {
                echo "✅ Archivo encontrado en backup: $file\n";
                $foundFiles++;
            } else {
                echo "⚠️ Archivo no encontrado en backup: $file\n";
            }
        }
        
        if ($foundFiles === 0) {
            throw new Exception("No se encontraron archivos para restaurar en el backup");
        }
    }

    private function performRollback() {
        echo "\n🔄 Restaurando archivos originales...\n";
        
        foreach ($this->files as $file) {
            $backupPath = $this->backupDir . '/' . $file;
            $currentPath = __DIR__ . '/' . $file;
            
            if (!file_exists($backupPath)) {
                echo "⚠️ Archivo no existe en backup, se omite: $file\n";
                continue;
            }
            
            if (copy($backupPath, $currentPath)) {
                echo "✅ Restaurado: $file\n";
            } else {
                throw new Exception("Error al restaurar: $file");
            }
        }
    }

    private function verifyRollback() {
        echo "\n🔍 Verificando rollback...\n";
        
        foreach ($this->files as $file) {
            $filePath = __DIR__ . '/' . $file;
            
            if (!file_exists($filePath)) {
                echo "⚠️ Archivo no existe después del rollback: $file\n";
                continue;
            }
            
            $content = file_get_contents($filePath);
            
            // Verificar que es una versión original (no debería tener SecurityConfig)
            if (strpos($content, 'SecurityConfig::getInstance()') !== false) {
                echo "⚠️ Archivo aún contiene SecurityConfig (¿rollback incompleto?): $file\n";
            } else {
                echo "✅ Verificado: $file (versión original restaurada)\n";
            }
        }
    }

    public function listAvailableBackups() {
        $pattern = __DIR__ . '/backup_migration_*';
        $backups = glob($pattern);
        
        if (empty($backups)) {
            echo "No se encontraron directorios de backup\n";
            return;
        }
        
        echo "📁 Backups disponibles:\n";
        foreach ($backups as $backup) {
            $basename = basename($backup);
            $date = filemtime($backup);
            echo "  - $basename (" . date('Y-m-d H:i:s', $date) . ")\n";
        }
    }
}

// Verificar argumentos
if (isset($argv[1])) {
    if ($argv[1] === '--list') {
        $rollback = new SecurityRollback();
        $rollback->listAvailableBackups();
        exit;
    } elseif ($argv[1] === '--backup') {
        if (!isset($argv[2])) {
            die("❌ Error: Especifique el directorio de backup después de --backup\n");
        }
        $rollback = new SecurityRollback($argv[2]);
    } else {
        die("❌ Error: Uso: php rollback_security_migration.php [--list | --backup <directorio>]\n");
    }
} else {
    $rollback = new SecurityRollback();
}

// Ejecutar rollback
$rollback->run();
?>
