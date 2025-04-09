<?php
session_start();

if (isset($_GET['mensaje'])) { // Verifica si hay un mensaje en la URL
    $_SESSION['mensaje'] = $_GET['mensaje']; // Guarda el mensaje en la sesión
}

header('Location: http://tusitio.com/pagina-principal'); // Redirige a la página principal
exit;
?>