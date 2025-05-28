<?php

//oculta errores de deprecated y notice
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);


session_start();

if (isset($_SESSION['mensaje'])) { // Verifica si hay un mensaje en la sesión
    echo '<div class="alert alert-success">' . $_SESSION['mensaje'] . '</div>'; // Muestra el mensaje
    unset($_SESSION['mensaje']); // Limpia el mensaje de la sesión
}
?>