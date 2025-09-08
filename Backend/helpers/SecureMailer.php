<?php
/**
 * 📧 MAILER SEGURO - PRE-COMPRA
 * 
 * Clase para manejo centralizado y seguro de envío de correos,
 * eliminando todas las credenciales hardcodeadas.
 * 
 * Versión: 2.0
 * Fecha: 8 de septiembre de 2025
 */

require_once __DIR__ . '/SecurityConfig.php';
require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class SecureMailer
{
    private $config;
    private $mailer;
    private static $instance = null;

    private function __construct()
    {
        $this->config = SecurityConfig::getInstance();
        $this->setupMailer();
    }

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Configurar PHPMailer con credenciales de SecurityConfig
     */
    private function setupMailer()
    {
        $this->mailer = new PHPMailer(true);
        $smtp = $this->config->getSmtpConfig();

        // Configuración SMTP usando variables de entorno
        $this->mailer->isSMTP();
        $this->mailer->Host = $smtp['host'];
        $this->mailer->SMTPAuth = true;
        $this->mailer->Username = $smtp['username'];
        $this->mailer->Password = $smtp['password'];
        $this->mailer->Port = $smtp['port'];
        
        // Configurar encriptación
        switch (strtolower($smtp['secure'])) {
            case 'ssl':
                $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
                break;
            case 'tls':
            case 'starttls':
                $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                break;
            default:
                $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                break;
        }

        // Configuración adicional
        $this->mailer->CharSet = 'UTF-8';
        $this->mailer->Encoding = 'base64';
        $this->mailer->Timeout = 15;

        // Configurar remitente por defecto
        if (!empty($smtp['from_email'])) {
            $this->mailer->setFrom($smtp['from_email'], $smtp['from_name']);
        }

        // Debugging en desarrollo
        if ($this->config->isDevelopment()) {
            $this->mailer->SMTPDebug = 2;
            $this->mailer->Debugoutput = function($str, $level) { 
                error_log("SMTP: $str"); 
            };
        }
    }

    /**
     * Enviar correo de manera segura
     */
    public function sendMail($datos, $debugMode = false)
    {
        try {
            // Verificar si debemos simular el envío
            if ($this->shouldSimulate($debugMode)) {
                return $this->simulateEmailSending($datos);
            }

            // Validar datos requeridos
            $this->validateEmailData($datos);

            // Limpiar destinatarios anteriores
            $this->mailer->clearAddresses();
            $this->mailer->clearCCs();
            $this->mailer->clearBCCs();
            $this->mailer->clearAttachments();

            // Configurar destinatarios
            $this->setupRecipients($datos);

            // Configurar contenido
            $this->setupContent($datos);

            // Adjuntar archivos si existen
            $this->setupAttachments($datos);

            // Enviar
            $this->mailer->send();

            error_log("✅ Correo enviado exitosamente a: " . $datos['destinatario']);
            
            return [
                'success' => true,
                'message' => 'Correo enviado correctamente'
            ];

        } catch (Exception $e) {
            error_log("❌ Error al enviar correo: " . $e->getMessage());
            
            return [
                'success' => false,
                'error' => 'Error al enviar correo: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Verificar si debemos simular el envío
     */
    private function shouldSimulate($debugMode)
    {
        return $debugMode || $this->config->shouldSimulateEmail();
    }

    /**
     * Simular envío de correo para desarrollo
     */
    private function simulateEmailSending($datos)
    {
        error_log("📧 SIMULACIÓN DE CORREO:");
        error_log("   - Destinatario: " . $datos['destinatario']);
        error_log("   - Asunto: " . $datos['asunto']);
        error_log("   - CC: " . ($datos['cc'] ?? 'N/A'));
        error_log("   - BCC: " . ($datos['bcc'] ?? 'N/A'));
        error_log("   - Tiene HTML: " . (!empty($datos['mensajeHtml']) ? 'SI' : 'NO'));
        error_log("   - Tiene Texto: " . (!empty($datos['mensajeTexto']) ? 'SI' : 'NO'));
        error_log("   - Adjuntos: " . (!empty($datos['adjuntos']) ? count((array)$datos['adjuntos']) : '0'));

        return [
            'success' => true,
            'message' => 'Correo simulado exitosamente (modo desarrollo)',
            'debug' => 'Email no enviado realmente - Modo simulación activo'
        ];
    }

    /**
     * Validar datos del correo
     */
    private function validateEmailData($datos)
    {
        if (empty($datos['destinatario'])) {
            throw new Exception('Destinatario es requerido');
        }

        if (!filter_var($datos['destinatario'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Email destinatario inválido: ' . $datos['destinatario']);
        }

        if (empty($datos['asunto'])) {
            throw new Exception('Asunto es requerido');
        }

        if (empty($datos['mensajeHtml']) && empty($datos['mensajeTexto'])) {
            throw new Exception('Mensaje HTML o texto es requerido');
        }
    }

    /**
     * Configurar destinatarios
     */
    private function setupRecipients($datos)
    {
        // Destinatario principal
        $this->mailer->addAddress($datos['destinatario']);

        // CC (Copia)
        if (!empty($datos['cc'])) {
            if (is_array($datos['cc'])) {
                foreach ($datos['cc'] as $cc) {
                    if (filter_var($cc, FILTER_VALIDATE_EMAIL)) {
                        $this->mailer->addCC($cc);
                    }
                }
            } else {
                if (filter_var($datos['cc'], FILTER_VALIDATE_EMAIL)) {
                    $this->mailer->addCC($datos['cc']);
                }
            }
        }

        // BCC (Copia oculta)
        if (!empty($datos['bcc'])) {
            if (is_array($datos['bcc'])) {
                foreach ($datos['bcc'] as $bcc) {
                    if (filter_var($bcc, FILTER_VALIDATE_EMAIL)) {
                        $this->mailer->addBCC($bcc);
                    }
                }
            } else {
                if (filter_var($datos['bcc'], FILTER_VALIDATE_EMAIL)) {
                    $this->mailer->addBCC($datos['bcc']);
                }
            }
        }
    }

    /**
     * Configurar contenido del correo
     */
    private function setupContent($datos)
    {
        $this->mailer->Subject = $datos['asunto'];

        // Configurar HTML y texto alternativo
        if (!empty($datos['mensajeHtml'])) {
            $this->mailer->isHTML(true);
            $this->mailer->Body = $datos['mensajeHtml'];
            
            // Texto alternativo
            if (!empty($datos['mensajeTexto'])) {
                $this->mailer->AltBody = $datos['mensajeTexto'];
            }
        } else {
            $this->mailer->isHTML(false);
            $this->mailer->Body = $datos['mensajeTexto'];
        }
    }

    /**
     * Configurar adjuntos
     */
    private function setupAttachments($datos)
    {
        if (!empty($datos['adjuntos'])) {
            $adjuntos = is_array($datos['adjuntos']) ? $datos['adjuntos'] : [$datos['adjuntos']];
            
            foreach ($adjuntos as $adjunto) {
                if (is_string($adjunto) && file_exists($adjunto)) {
                    $this->mailer->addAttachment($adjunto);
                } elseif (is_array($adjunto) && isset($adjunto['ruta']) && file_exists($adjunto['ruta'])) {
                    $nombre = $adjunto['nombre'] ?? basename($adjunto['ruta']);
                    $this->mailer->addAttachment($adjunto['ruta'], $nombre);
                }
            }
        }
    }

    /**
     * Método estático para envío rápido (compatibilidad)
     */
    public static function send($datos, $debugMode = false)
    {
        return self::getInstance()->sendMail($datos, $debugMode);
    }

    /**
     * Obtener configuración actual del mailer
     */
    public function getConfiguration()
    {
        $smtp = $this->config->getSmtpConfig();
        
        return [
            'host' => $smtp['host'],
            'port' => $smtp['port'],
            'secure' => $smtp['secure'],
            'username' => !empty($smtp['username']) ? 'CONFIGURADO' : 'NO_CONFIGURADO',
            'password' => !empty($smtp['password']) ? 'CONFIGURADO' : 'NO_CONFIGURADO',
            'from_email' => $smtp['from_email'],
            'from_name' => $smtp['from_name'],
            'development_mode' => $this->config->isDevelopment(),
            'simulate_email' => $this->config->shouldSimulateEmail()
        ];
    }
}

/**
 * Función de compatibilidad con enviarCorreo existente
 */
if (!function_exists('enviarCorreo')) {
    function enviarCorreo($datos, $debugMode = false) {
        return SecureMailer::send($datos, $debugMode);
    }
}
