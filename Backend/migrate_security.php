<?php
/**
 * 🔒 SCRIPT DE MIGRACIÓN DE SEGURIDAD
 * 
 * Script para migrar automáticamente de versiones con credenciales hardcodeadas
 * a las nuevas versiones seguras con SecurityConfig.
 * 
 * Este script:
 * 1. Respalda los archivos originales
 * 2. Reemplaza los archivos por las versiones seguras
 * 3. Verifica que la migración sea exitosa
 * 4. Proporciona rollback en caso de errores
 * 
 * Versión: 1.0
 * Fecha: 8 de septiembre de 2025
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

class SecurityMigrator {
    private $backupDir;
    private $migrations = [];
    private $completed = [];

    public function __construct() {
        $this->backupDir = __DIR__ . '/backup_migration_' . date('Y-m-d_H-i-s');
        
        // Definir migraciones
        $this->migrations = [
            'notificarTransferencia.php' => 'notificarTransferencia_secure.php',
            'enviarAgendamiento.php' => 'enviarAgendamiento_secure.php',
            'enviarCotizacion.php' => 'enviarCotizacion_secure.php'
        ];
    }

    public function run() {
        echo "🔒 INICIANDO MIGRACIÓN DE SEGURIDAD\n";
        echo "==================================\n\n";

        try {
            $this->createBackupDir();
            $this->backupOriginalFiles();
            $this->performMigration();
            $this->verifyMigration();
            
            echo "\n✅ MIGRACIÓN COMPLETADA EXITOSAMENTE\n";
            echo "📁 Backup disponible en: {$this->backupDir}\n";
            echo "🔄 Para revertir, ejecute: rollback_security_migration.php\n";
            
        } catch (Exception $e) {
            echo "\n❌ ERROR EN MIGRACIÓN: " . $e->getMessage() . "\n";
            $this->rollback();
        }
    }

    private function createBackupDir() {
        if (!is_dir($this->backupDir)) {
            if (!mkdir($this->backupDir, 0755, true)) {
                throw new Exception("No se pudo crear directorio de backup: {$this->backupDir}");
            }
        }
        echo "📁 Directorio de backup creado: {$this->backupDir}\n";
    }

    private function backupOriginalFiles() {
        echo "\n📋 Respaldando archivos originales...\n";
        
        foreach ($this->migrations as $original => $secure) {
            $originalPath = __DIR__ . '/' . $original;
            $backupPath = $this->backupDir . '/' . $original;
            
            if (file_exists($originalPath)) {
                if (copy($originalPath, $backupPath)) {
                    echo "✅ Respaldado: $original\n";
                } else {
                    throw new Exception("Error al respaldar: $original");
                }
            } else {
                echo "⚠️ Archivo no encontrado (se omite): $original\n";
            }
        }
    }

    private function performMigration() {
        echo "\n🔄 Realizando migración...\n";
        
        foreach ($this->migrations as $original => $secure) {
            $originalPath = __DIR__ . '/' . $original;
            $securePath = __DIR__ . '/' . $secure;
            
            if (!file_exists($securePath)) {
                echo "⚠️ Archivo seguro no encontrado: $secure\n";
                continue;
            }
            
            if (file_exists($originalPath)) {
                // Reemplazar archivo original
                if (copy($securePath, $originalPath)) {
                    echo "✅ Migrado: $original -> versión segura\n";
                    $this->completed[] = $original;
                } else {
                    throw new Exception("Error al migrar: $original");
                }
            } else {
                // Crear nuevo archivo
                if (copy($securePath, $originalPath)) {
                    echo "✅ Creado: $original (nuevo archivo seguro)\n";
                    $this->completed[] = $original;
                } else {
                    throw new Exception("Error al crear: $original");
                }
            }
        }
    }

    private function verifyMigration() {
        echo "\n🔍 Verificando migración...\n";
        
        foreach ($this->completed as $file) {
            $filePath = __DIR__ . '/' . $file;
            
            if (!file_exists($filePath)) {
                throw new Exception("Archivo migrado no existe: $file");
            }
            
            $content = file_get_contents($filePath);
            
            // Verificar que usa SecurityConfig
            if (strpos($content, 'SecurityConfig::getInstance()') === false) {
                throw new Exception("Archivo no usa SecurityConfig: $file");
            }
            
            // Verificar que no tiene credenciales hardcodeadas
            $patterns = [
                '/password_seguro_123/',
                '/smtp\.gmail\.com.*465/',
                '/["\']smtp_username["\'].*=>.*["\'][^"\']*@[^"\']*["\']/',
                '/["\']smtp_password["\'].*=>.*["\'][^"\']+["\']/'
            ];
            
            foreach ($patterns as $pattern) {
                if (preg_match($pattern, $content)) {
                    throw new Exception("Credenciales hardcodeadas detectadas en: $file");
                }
            }
            
            echo "✅ Verificado: $file (sin credenciales hardcodeadas)\n";
        }
    }

    private function rollback() {
        echo "\n🔄 Iniciando rollback...\n";
        
        foreach ($this->completed as $file) {
            $originalPath = __DIR__ . '/' . $file;
            $backupPath = $this->backupDir . '/' . $file;
            
            if (file_exists($backupPath)) {
                if (copy($backupPath, $originalPath)) {
                    echo "✅ Restaurado: $file\n";
                } else {
                    echo "❌ Error al restaurar: $file\n";
                }
            }
        }
        
        echo "\n📁 Backup mantenido en: {$this->backupDir}\n";
    }
}

// Verificar que estamos en el directorio correcto
if (!file_exists(__DIR__ . '/helpers/SecurityConfig.php')) {
    die("❌ Error: SecurityConfig.php no encontrado. Ejecute desde el directorio Backend/\n");
}

// Ejecutar migración
$migrator = new SecurityMigrator();
$migrator->run();
?>
