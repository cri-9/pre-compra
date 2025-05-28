<?php
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);

session_start();

if (isset($_GET['mensaje'])) {
    $_SESSION['mensaje'] = $_GET['mensaje'];
}

// En desarrollo:
//header('Location: http://localhost:3000/');
// En producción, cambia la URL por la de tu dominio real
header("Access-Control-Allow-Origin: https://visualmecanica.cl");
exit;
?>