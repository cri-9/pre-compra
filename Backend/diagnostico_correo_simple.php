<?php
// Diagnóstico simple de correo
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== DIAGNÓSTICO DE CORREO ===\n\n";

// 1. Verificar .env
require_once __DIR__ . '/helpers/env.php';

echo "1. Variables SMTP:\n";
echo "SMTP_HOST: " . getenv_backend('SMTP_HOST') . "\n";
echo "SMTP_PORT: " . getenv_backend('SMTP_PORT') . "\n";
echo "SMTP_SECURE: " . getenv_backend('SMTP_SECURE') . "\n";
echo "SMTP_USER: " . getenv_backend('SMTP_USER') . "\n";
echo "SMTP_PASS: " . (getenv_backend('SMTP_PASS') ? '***CONFIGURADA***' : 'NO CONFIGURADA') . "\n";
echo "MAIL_FROM: " . getenv_backend('MAIL_FROM') . "\n";
echo "DEV_MODE: " . getenv_backend('DEV_MODE') . "\n";
echo "SIMULATE_EMAIL: " . getenv_backend('SIMULATE_EMAIL') . "\n\n";

// 2. Verificar PHPMailer
require_once __DIR__ . '/vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

echo "2. PHPMailer disponible: " . (class_exists('PHPMailer\PHPMailer\PHPMailer') ? 'SÍ' : 'NO') . "\n\n";

// 3. Probar configuración SMTP básica
echo "3. Prueba de configuración SMTP:\n";

try {
    $mail = new PHPMailer(true);
    
    // Configuración básica
    $mail->isSMTP();
    $mail->Host = getenv_backend('SMTP_HOST', 'smtp.gmail.com');
    $mail->SMTPAuth = true;
    $mail->Username = getenv_backend('SMTP_USER');
    $mail->Password = getenv_backend('SMTP_PASS');
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = (int)getenv_backend('SMTP_PORT', 587);
    
    // Configurar debug para ver detalles
    $mail->SMTPDebug = 2;
    $mail->Debugoutput = function($str, $level) {
        echo "SMTP DEBUG: $str\n";
    };
    
    // Configurar correo de prueba
    $mail->setFrom(getenv_backend('MAIL_FROM'), 'Test Sistema');
    $mail->addAddress('test@example.com'); // Email de prueba
    $mail->Subject = 'Test de configuración SMTP';
    $mail->Body = 'Este es un test de configuración SMTP';
    
    echo "Configuración SMTP establecida correctamente\n";
    echo "Host: " . $mail->Host . "\n";
    echo "Puerto: " . $mail->Port . "\n";
    echo "Usuario: " . $mail->Username . "\n";
    echo "Remitente: " . getenv_backend('MAIL_FROM') . "\n\n";
    
    // NO enviar realmente, solo verificar configuración
    echo "4. Configuración válida - NO se envió correo real\n";
    
} catch (Exception $e) {
    echo "ERROR en configuración SMTP: " . $e->getMessage() . "\n";
    echo "Detalles: " . $mail->ErrorInfo . "\n";
}

echo "\n=== FIN DIAGNÓSTICO ===\n";
?>