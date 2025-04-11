<?php
$host = 'localhost';
$db = 'precompra';
$user = 'root';
$pass = ' ';

try {
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error de conexión: ' . $e->getMessage()]);
    exit;
}
?>

