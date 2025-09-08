<?php
/**
 * 🔒 CONEXIÓN SEGURA A BASE DE DATOS - PRE-COMPRA
 * 
 * Clase para manejo centralizado y seguro de conexiones a base de datos,
 * eliminando todas las credenciales hardcodeadas.
 * 
 * Versión: 2.0
 * Fecha: 8 de septiembre de 2025
 */

require_once __DIR__ . '/SecurityConfig.php';

class SecureDatabase
{
    private static $instance = null;
    private $connection = null;
    private $config;

    private function __construct()
    {
        $this->config = SecurityConfig::getInstance();
        $this->connect();
    }

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Establecer conexión segura a la base de datos
     */
    private function connect()
    {
        try {
            $dbConfig = $this->config->getDatabaseConfig();
            
            // Validar configuración crítica
            if (empty($dbConfig['name']) || empty($dbConfig['user'])) {
                throw new Exception('Configuración de base de datos incompleta');
            }

            // Construir DSN
            $dsn = "mysql:host={$dbConfig['host']};port={$dbConfig['port']};dbname={$dbConfig['name']};charset=utf8mb4";

            // Opciones de PDO para seguridad
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
            ];

            // Crear conexión
            $this->connection = new PDO(
                $dsn,
                $dbConfig['user'],
                $dbConfig['password'],
                $options
            );

            error_log("🔐 Conexión segura a base de datos establecida: {$dbConfig['host']}/{$dbConfig['name']}");

        } catch (PDOException $e) {
            error_log("❌ Error de conexión a base de datos: " . $e->getMessage());
            throw new Exception('Error de conexión a base de datos');
        }
    }

    /**
     * Obtener conexión PDO
     */
    public function getConnection()
    {
        // Verificar si la conexión sigue activa
        if ($this->connection === null) {
            $this->connect();
        }

        try {
            $this->connection->query('SELECT 1');
        } catch (PDOException $e) {
            // Reconectar si la conexión se perdió
            $this->connect();
        }

        return $this->connection;
    }

    /**
     * Ejecutar consulta preparada de manera segura
     */
    public function query($sql, $params = [])
    {
        try {
            $stmt = $this->getConnection()->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            error_log("❌ Error en consulta SQL: " . $e->getMessage());
            throw new Exception('Error en consulta a base de datos');
        }
    }

    /**
     * Obtener un registro
     */
    public function fetchOne($sql, $params = [])
    {
        $stmt = $this->query($sql, $params);
        return $stmt->fetch();
    }

    /**
     * Obtener múltiples registros
     */
    public function fetchAll($sql, $params = [])
    {
        $stmt = $this->query($sql, $params);
        return $stmt->fetchAll();
    }

    /**
     * Insertar registro y obtener ID
     */
    public function insert($table, $data)
    {
        $keys = array_keys($data);
        $placeholders = ':' . implode(', :', $keys);
        $sql = "INSERT INTO {$table} (" . implode(', ', $keys) . ") VALUES ({$placeholders})";
        
        $this->query($sql, $data);
        return $this->getConnection()->lastInsertId();
    }

    /**
     * Actualizar registros
     */
    public function update($table, $data, $where, $whereParams = [])
    {
        $setParts = [];
        foreach (array_keys($data) as $key) {
            $setParts[] = "{$key} = :{$key}";
        }
        
        $sql = "UPDATE {$table} SET " . implode(', ', $setParts) . " WHERE {$where}";
        $params = array_merge($data, $whereParams);
        
        $stmt = $this->query($sql, $params);
        return $stmt->rowCount();
    }

    /**
     * Eliminar registros
     */
    public function delete($table, $where, $whereParams = [])
    {
        $sql = "DELETE FROM {$table} WHERE {$where}";
        $stmt = $this->query($sql, $whereParams);
        return $stmt->rowCount();
    }

    /**
     * Comenzar transacción
     */
    public function beginTransaction()
    {
        return $this->getConnection()->beginTransaction();
    }

    /**
     * Confirmar transacción
     */
    public function commit()
    {
        return $this->getConnection()->commit();
    }

    /**
     * Revertir transacción
     */
    public function rollback()
    {
        return $this->getConnection()->rollback();
    }

    /**
     * Escapar valor para SQL (usar solo en casos especiales)
     */
    public function quote($value)
    {
        return $this->getConnection()->quote($value);
    }

    /**
     * Obtener información de la conexión
     */
    public function getConnectionInfo()
    {
        $dbConfig = $this->config->getDatabaseConfig();
        
        return [
            'host' => $dbConfig['host'],
            'port' => $dbConfig['port'],
            'database' => $dbConfig['name'],
            'user' => $dbConfig['user'],
            'charset' => 'utf8mb4',
            'connected' => $this->connection !== null
        ];
    }

    /**
     * Verificar salud de la conexión
     */
    public function healthCheck()
    {
        try {
            $result = $this->fetchOne('SELECT 1 as test, NOW() as timestamp');
            return [
                'status' => 'OK',
                'timestamp' => $result['timestamp'],
                'connection_active' => true
            ];
        } catch (Exception $e) {
            return [
                'status' => 'ERROR',
                'error' => $e->getMessage(),
                'connection_active' => false
            ];
        }
    }
}

/**
 * Función de compatibilidad global
 */
if (!function_exists('getSecureConnection')) {
    function getSecureConnection() {
        return SecureDatabase::getInstance()->getConnection();
    }
}
