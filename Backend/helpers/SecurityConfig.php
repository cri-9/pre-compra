<?php
/**
 * 🛡️ CONFIGURADOR DE SEGURIDAD - PRE-COMPRA
 * 
 * Este archivo centraliza toda la configuración de seguridad del proyecto,
 * eliminando credenciales hardcodeadas y unificando el manejo de variables de entorno.
 * 
 * Versión: 2.0
 * Fecha: 8 de septiembre de 2025
 */

class SecurityConfig
{
    private static $instance = null;
    private $config = [];
    private $envLoaded = false;

    private function __construct()
    {
        $this->loadEnvironmentVariables();
    }

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Cargar variables de entorno desde archivo .env
     */
    private function loadEnvironmentVariables()
    {
        if ($this->envLoaded) {
            return;
        }

        // Cargar helper de env si existe
        $envHelper = __DIR__ . '/helpers/env.php';
        if (file_exists($envHelper)) {
            require_once $envHelper;
        }

        // Detectar archivo de entorno apropiado
        $envFile = $this->detectEnvironmentFile();
        
        if ($envFile && file_exists($envFile)) {
            $this->parseEnvFile($envFile);
        }

        $this->envLoaded = true;
        error_log("🔐 SecurityConfig: Variables de entorno cargadas desde: " . ($envFile ?: 'sistema'));
    }

    /**
     * Detectar qué archivo .env usar
     */
    private function detectEnvironmentFile()
    {
        $baseDir = __DIR__;
        
        // En producción, usar .env.production
        if ($this->isProduction()) {
            $prodFile = $baseDir . '/.env.production';
            if (file_exists($prodFile)) {
                return $prodFile;
            }
        }

        // En desarrollo, usar .env
        $devFile = $baseDir . '/.env';
        if (file_exists($devFile)) {
            return $devFile;
        }

        return null;
    }

    /**
     * Detectar si estamos en producción
     */
    private function isProduction()
    {
        // Verificar indicadores de producción
        $indicators = [
            $_SERVER['NODE_ENV'] ?? '',
            $_SERVER['APP_ENV'] ?? '',
            $_SERVER['HTTP_HOST'] ?? ''
        ];

        foreach ($indicators as $indicator) {
            if (in_array(strtolower($indicator), ['production', 'prod'])) {
                return true;
            }
            if (strpos($indicator, 'visualmecanica.cl') !== false) {
                return true;
            }
        }

        return false;
    }

    /**
     * Parsear archivo .env
     */
    private function parseEnvFile($filepath)
    {
        $lines = file($filepath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        
        foreach ($lines as $line) {
            $line = trim($line);
            
            // Ignorar comentarios
            if (strpos($line, '#') === 0) {
                continue;
            }

            // Parsear línea KEY=VALUE
            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);
                
                // Remover comillas si existen
                $value = trim($value, '"\'');
                
                $this->config[$key] = $value;
                
                // También setear en $_ENV para compatibilidad
                if (!isset($_ENV[$key])) {
                    $_ENV[$key] = $value;
                }
            }
        }
    }

    /**
     * Obtener valor de configuración con fallback seguro
     */
    public function get($key, $default = null)
    {
        // Prioridades: archivo .env > variable de entorno > default
        if (isset($this->config[$key])) {
            return $this->config[$key];
        }

        if (isset($_ENV[$key])) {
            return $_ENV[$key];
        }

        $envValue = getenv($key);
        if ($envValue !== false) {
            return $envValue;
        }

        return $default;
    }

    /**
     * Obtener configuración SMTP segura
     */
    public function getSmtpConfig()
    {
        return [
            'host' => $this->get('SMTP_HOST', 'smtp.hostinger.com'),
            'port' => (int)$this->get('SMTP_PORT', 587),
            'secure' => $this->get('SMTP_SECURE', 'tls'),
            'username' => $this->get('SMTP_USER'),
            'password' => $this->get('SMTP_PASS'),
            'from_email' => $this->get('MAIL_FROM'),
            'from_name' => $this->get('MAIL_FROM_NAME', 'Visual Mecánica'),
        ];
    }

    /**
     * Obtener configuración de base de datos segura
     */
    public function getDatabaseConfig()
    {
        return [
            'host' => $this->get('DB_HOST', 'localhost'),
            'name' => $this->get('DB_NAME'),
            'user' => $this->get('DB_USER'),
            'password' => $this->get('DB_PASS'),
            'port' => (int)$this->get('DB_PORT', 3306),
        ];
    }

    /**
     * Obtener configuración de Google APIs
     */
    public function getGoogleConfig()
    {
        return [
            'client_id' => $this->get('GOOGLE_CLIENT_ID'),
            'client_secret' => $this->get('GOOGLE_CLIENT_SECRET'),
            'redirect_uri' => $this->get('GOOGLE_REDIRECT_URI'),
        ];
    }

    /**
     * Verificar si estamos en modo de desarrollo
     */
    public function isDevelopment()
    {
        return in_array(strtolower($this->get('DEV_MODE', 'false')), ['true', '1', 'yes', 'on']);
    }

    /**
     * Verificar si debemos simular emails
     */
    public function shouldSimulateEmail()
    {
        return in_array(strtolower($this->get('SIMULATE_EMAIL', 'false')), ['true', '1', 'yes', 'on']);
    }

    /**
     * Verificar si debemos simular Google Calendar
     */
    public function shouldSimulateCalendar()
    {
        return in_array(strtolower($this->get('SIMULATE_CALENDAR', 'false')), ['true', '1', 'yes', 'on']);
    }

    /**
     * Obtener URL del frontend
     */
    public function getFrontendUrl()
    {
        return $this->get('FRONTEND_URL', 'http://localhost:3001');
    }

    /**
     * Obtener URL del backend
     */
    public function getBackendUrl()
    {
        return $this->get('APP_URL', 'http://localhost:8080');
    }

    /**
     * Validar que todas las configuraciones críticas estén presentes
     */
    public function validateCriticalConfig()
    {
        $errors = [];
        
        // Validar SMTP
        $smtp = $this->getSmtpConfig();
        if (empty($smtp['username'])) {
            $errors[] = 'SMTP_USER no está configurado';
        }
        if (empty($smtp['password'])) {
            $errors[] = 'SMTP_PASS no está configurado';
        }

        // Validar Base de datos
        $db = $this->getDatabaseConfig();
        if (empty($db['name'])) {
            $errors[] = 'DB_NAME no está configurado';
        }
        if (empty($db['user'])) {
            $errors[] = 'DB_USER no está configurado';
        }

        return $errors;
    }

    /**
     * Log de configuración (sin mostrar credenciales)
     */
    public function logConfiguration()
    {
        $smtp = $this->getSmtpConfig();
        $db = $this->getDatabaseConfig();
        
        error_log("🔐 Configuración de Seguridad:");
        error_log("   - Modo desarrollo: " . ($this->isDevelopment() ? 'SI' : 'NO'));
        error_log("   - Simular email: " . ($this->shouldSimulateEmail() ? 'SI' : 'NO'));
        error_log("   - Simular calendar: " . ($this->shouldSimulateCalendar() ? 'SI' : 'NO'));
        error_log("   - SMTP Host: " . $smtp['host']);
        error_log("   - SMTP User: " . (!empty($smtp['username']) ? 'CONFIGURADO' : 'NO_CONFIGURADO'));
        error_log("   - SMTP Pass: " . (!empty($smtp['password']) ? 'CONFIGURADO' : 'NO_CONFIGURADO'));
        error_log("   - DB Host: " . $db['host']);
        error_log("   - DB Name: " . $db['name']);
        error_log("   - DB User: " . (!empty($db['user']) ? 'CONFIGURADO' : 'NO_CONFIGURADO'));
    }
}

/**
 * Función de compatibilidad con getenv_backend existente
 */
if (!function_exists('getenv_backend')) {
    function getenv_backend($key, $default = null) {
        return SecurityConfig::getInstance()->get($key, $default);
    }
}

/**
 * Función para obtener configuración SMTP segura
 */
if (!function_exists('getSecureSmtpConfig')) {
    function getSecureSmtpConfig() {
        return SecurityConfig::getInstance()->getSmtpConfig();
    }
}

/**
 * Función para obtener configuración de DB segura
 */
if (!function_exists('getSecureDatabaseConfig')) {
    function getSecureDatabaseConfig() {
        return SecurityConfig::getInstance()->getDatabaseConfig();
    }
}
