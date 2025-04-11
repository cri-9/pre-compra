<?php
session_start();

if (isset($_GET['mensaje'])) { // Verifica si hay un mensaje en la URL
    $_SESSION['mensaje'] = $_GET['mensaje']; // Guarda el mensaje en la sesión
}

header('http://localhost:5173/'); // Redirige a la página principal
exit;
?>