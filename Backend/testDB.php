<?php
$conn = new mysqli("localhost", "root", "", "precompra_db");

if ($conn->connect_error) {
    die("Falló la conexión: " . $conn->connect_error);
}
echo "Conexión exitosa";
