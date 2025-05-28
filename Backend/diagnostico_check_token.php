<?php
// Ejemplo de llamada: diagnostico_check_token.php?token=ELTOKEN

if (php_sapi_name() !== 'cli' && !isset($_GET['token'])) {
    echo "ERROR: Debes indicar el parámetro ?token=";
    exit;
}
$token = $_GET['token'];

$path = __DIR__ . "/tmp_datosform_$token.json";
?>
<html>
<head><meta charset="utf-8"><title>Diagnóstico de Token Backend</title></head>
<body>
<h2>Diagnóstico de token: <code><?= htmlentities($token) ?></code></h2>
<?php
if (!file_exists($path)) {
    echo "<p style='color:red;'>NO EXISTE el archivo temporal <b>" . basename($path) . "</b></p>";
} else {
    echo "<p style='color:green;'>Archivo encontrado: <b>" . basename($path) . "</b></p>";
    $contenido = file_get_contents($path);
    echo "<pre style='background:#eee; padding:12px; border-radius:6px;'>" .
        htmlentities($contenido) .
        "</pre>";
    $json = json_decode($contenido, true);
    if ($json && isset($json['agendamiento'])) {
        echo "<p style='color:blue;'><b>agendamiento.fecha:</b> " . htmlentities($json['agendamiento']['fecha'] ?? 'NULL') . " | <b>agendamiento.bloque:</b> " . htmlentities($json['agendamiento']['bloque'] ?? 'NULL') . "</p>";
    }
}
?>
</body>
</html>