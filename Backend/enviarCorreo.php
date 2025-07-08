<?php
require_once __DIR__ . '/helpers/env.php';
//oculta errores de deprecated y notice
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

/**
 * Envía un correo usando PHPMailer, con opción de modo debug para depuración rápida.
 *
 * @param array $datos Array con claves: 'destinatario', 'asunto', 'mensajeHtml', 'mensajeTexto', opcional 'cc', 'bcc', 'adjuntos' (ruta o arreglo de rutas de archivos)
 * @param bool $modoDebug Si es true, no envía el correo y simula éxito.
 * @return array ['success' => bool, 'error' => string|null]
 */
function enviarCorreo($datos, $modoDebug = false) {
    try {
        error_log("INICIO enviarCorreo");

        // Validación básica de email
        if (empty($datos['destinatario']) || !filter_var($datos['destinatario'], FILTER_VALIDATE_EMAIL)) {
            error_log("Email destinatario inválido: " . ($datos['destinatario'] ?? 'no especificado'));
            return [
                'success' => false,
                'error' => 'Email destinatario inválido'
            ];
        }

        // Verificar si estamos en modo de desarrollo y simulación de email
        $devMode = in_array(getenv_backend('DEV_MODE', 'false'), ['true', '1', 'yes', 'on']);
        $simulateEmail = in_array(getenv_backend('SIMULATE_EMAIL', 'false'), ['true', '1', 'yes', 'on']);
        $esModoSimulacion = $modoDebug || ($devMode && $simulateEmail);

        if ($esModoSimulacion) {
            error_log("MODO SIMULACIÓN ACTIVADO: No se envía correo real.");
            error_log("Datos del correo simulado: " . json_encode([
                'destinatario' => $datos['destinatario'],
                'asunto' => $datos['asunto'],
                'tiene_html' => !empty($datos['mensajeHtml']),
                'tiene_texto' => !empty($datos['mensajeTexto']),
                'cc' => $datos['cc'] ?? null,
                'bcc' => $datos['bcc'] ?? null,
                'adjuntos' => !empty($datos['adjuntos']) ? 'sí' : 'no'
            ]));
            // Simula una respuesta exitosa sin enviar correo
            return [
                'success' => true,
                'debug' => 'Correo simulado (no enviado realmente) - Modo desarrollo'
            ];
        }

        // === LEER VARIABLES SMTP DE .env ===
        $smtpHost   = getenv_backend('SMTP_HOST', 'smtp.gmail.com');
        $smtpPort   = (int)getenv_backend('SMTP_PORT', 587);
        $smtpSecure = getenv_backend('SMTP_SECURE', PHPMailer::ENCRYPTION_STARTTLS);
        $smtpUser   = getenv_backend('SMTP_USER');
        $smtpPass   = getenv_backend('SMTP_PASS');
        $mailFrom   = getenv_backend('MAIL_FROM', $smtpUser);
        $fromName   = getenv_backend('MAIL_FROM_NAME', 'Sistema de Cotizaciones Visual Mecánica');

        error_log("Instanciando PHPMailer...");
        $mail = new PHPMailer(true);

        // Debugging SMTP
        $mail->SMTPDebug = 2; // Set to 0 on production
        $mail->Debugoutput = function($str, $level) { error_log("SMTP: $str"); };

        // Configuración SMTP
        $mail->CharSet  = 'UTF-8';
        $mail->Encoding = 'base64';
        $mail->isSMTP();
        $mail->Host       = $smtpHost;
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtpUser;
        $mail->Password   = $smtpPass;
        $mail->Port       = $smtpPort;
        $mail->SMTPSecure = $smtpSecure;
        $mail->Timeout    = 15;

        // Remitente y destinatario
        $mail->setFrom($mailFrom, $fromName);
        $mail->addAddress($datos['destinatario']); // Solo el email, sin nombre fijo

        // CC y BCC opcionales
        if (!empty($datos['cc']) && filter_var($datos['cc'], FILTER_VALIDATE_EMAIL)) {
            $mail->addCC($datos['cc']);
        }
        if (!empty($datos['bcc']) && filter_var($datos['bcc'], FILTER_VALIDATE_EMAIL)) {
            $mail->addBCC($datos['bcc']);
        }

        // Adjuntos opcionales (puede ser string o array de rutas)
        if (!empty($datos['adjuntos'])) {
            $adjuntos = is_array($datos['adjuntos']) ? $datos['adjuntos'] : [$datos['adjuntos']];
            foreach ($adjuntos as $adjunto) {
                if (file_exists($adjunto)) {
                    // Si es archivo .ics, forzar MIME para calendario
                    $nombreArchivo = basename($adjunto);
                    $mime = strtolower(pathinfo($adjunto, PATHINFO_EXTENSION)) === 'ics'
                        ? 'text/calendar'
                        : mime_content_type($adjunto);
                    $mail->addAttachment($adjunto, $nombreArchivo, 'base64', $mime);
                } else {
                    error_log("Adjunto no encontrado: $adjunto. No será enviado.");
                }
            }
        }

        // Contenido
        $mail->isHTML(true);
        $mail->Subject = $datos['asunto'];
        $mail->Body    = $datos['mensajeHtml'];
        $mail->AltBody = $datos['mensajeTexto'];

        error_log("Enviando correo a " . $datos['destinatario'] . "...");
        $mail->send();
        error_log("Correo enviado exitosamente a " . $datos['destinatario']);

        return [
            'success' => true
        ];

    } catch (Exception $e) {
        error_log(
            "ERROR en enviarCorreo: " . 
            ($mail->ErrorInfo ?? 'No ErrorInfo') . 
            " | Excepción: " . $e->getMessage() . 
            " | Trace: " . $e->getTraceAsString()
        );
        return [
            'success' => false,
            'error' => $mail->ErrorInfo ?: $e->getMessage()
        ];
    }
}
