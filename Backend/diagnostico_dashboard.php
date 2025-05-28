<?php
// diagnostico_dashboard.php
// Dashboard de diagnóstico/control para archivos temporales de agendamiento WebPay
// Autor: AI Qodo

// Configuración básica
date_default_timezone_set('America/Santiago');
$dir = __DIR__;
$files = glob($dir . '/tmp_datosform_*.json');

// Acciones de borrado
if (isset($_GET['delete'])) {
    $del = $_GET['delete'];
    if (preg_match('/^[a-zA-Z0-9]+$/', $del)) {
        $file = $dir . "/tmp_datosform_$del.json";
        if (file_exists($file)) {
            unlink($file);
            $msg = "Archivo $del ELIMINADO.";
        } else {
            $msg = "Archivo $del NO EXISTE.";
        }
    } else {
        $msg = "Token inválido.";
    }
    header("Location: diagnostico_dashboard.php?msg=" . urlencode($msg));
    exit;
}

// Borrado masivo (archivos viejos de 24+ horas)
if (isset($_GET['cleandays'])) {
    $limite = time() - 24*60*60;
    $borrados = 0;
    foreach ($files as $f) {
        if (filemtime($f) < $limite) {
            unlink($f);
            $borrados++;
        }
    }
    $msg = "Borrados $borrados archivos mayores a 24h.";
    header("Location: diagnostico_dashboard.php?msg=" . urlencode($msg));
    exit;
}

function filtrar($arr, $txt) {
    if (!$txt) return $arr;
    $txt = strtolower($txt);
    $result = [];
    foreach ($arr as $f) {
        $contenido = @file_get_contents($f);
        if (stripos($contenido, $txt) !== false) {
            $result[] = $f;
        }
    }
    return $result;
}

// Filtros de búsqueda
$buscar = trim($_GET['buscar'] ?? '');
$archivos = filtrar($files, $buscar);

// ---- HTML ----
?><!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Panel Diagnóstico Reservas/Agendas (WebPay)</title>
<style>
body { font-family: Arial, sans-serif; background: #f6f8fa; padding:0 10px; }
h1 { font-weight: 800; color: #1565c0; margin-top:24px;}
table { border-collapse: collapse; width: 100%; margin:16px 0; background:white;}
th, td { border: 1px solid #e0e0e0; padding: 8px 6px; text-align: left; font-size: 14px; }
th { background: #1976d2; color:white; font-weight:700;}
tr:nth-child(even) { background: #f2f8ff;}
input[type="text"] { padding:6px 12px; font-size:15px; width:260px; }
button, .btn { 
    background: #1976d2; color:white; border:none; 
    padding:6px 18px; border-radius:5px; cursor:pointer; font-weight:600; 
    font-size:14px; margin-top:8px; margin-right:8px;
}
.btn-delete { background:#c62828; }
.msg { background:#e9ffe9; color:#1b5e20; border:1px solid #bcdcbc; padding:8px 14px; margin:12px 0 0 0; border-radius:4px; display:inline-block;}
.invalido { background:#ffecb3 !important; color:#ad1d02; }
.small { color:#9e9e9e;font-size:12px;}
pre { background:#f7f7f7; padding:7px 12px; border-radius:4px;}
</style>
</head>
<body>
<h1>Panel Diagnóstico Archivos Temporales (WebPay/Agenda)</h1>
<?php if (isset($_GET['msg'])): ?>
<div class="msg"><?= htmlentities($_GET['msg']); ?></div>
<?php endif; ?>

<form method="get">
    <input type="text" name="buscar" placeholder="Buscar por email, token, fecha, etc..." value="<?= htmlentities($buscar) ?>" autofocus>
    <button type="submit">Buscar</button>
    <a href="diagnostico_dashboard.php" class="btn">Reset</a>
    <a href="diagnostico_dashboard.php?cleandays=1" class="btn btn-delete" onclick="return confirm('¿Seguro eliminar archivos con más de 24h?')">Limpiar archivos &gt;24h</a>
</form>

<table>
    <tr>
        <th>Token</th>
        <th>Fecha Agenda</th>
        <th>Bloque</th>
        <th>Email</th>
        <th>Monto</th>
        <th>Últ. Modificación</th>
        <th>Integridad</th>
        <th>Archivo</th>
        <th></th>
    </tr>
<?php
foreach ($archivos as $f):
    $bn = basename($f);
    $token = str_replace(['tmp_datosform_', '.json'], '', $bn);

    $contenido = @file_get_contents($f);
    $data = @json_decode($contenido, true);

    $fecha = $data['agendamiento']['fecha'] ?? '';
    $bloque = $data['agendamiento']['bloque'] ?? '';
    $email = $data['cliente']['email'] ?? '';
    $monto = $data['pago']['monto'] ?? '';
    $modif = date("d-m-Y H:i", filemtime($f));

    $integridad = "OK";
    $rowClass = "";
    if (!$fecha || !$bloque) { 
        $integridad = "<b>Error</b>"; 
        $rowClass = 'invalido';
    } elseif (!$email || !$monto) {
        $integridad = "Advertencia";
        $rowClass = 'invalido';
    }

    ?>
    <tr class="<?= $rowClass ?>">
        <td><?= htmlentities($token) ?></td>
        <td><?= htmlentities($fecha) ?></td>
        <td><?= htmlentities($bloque) ?></td>
        <td><?= htmlentities($email) ?></td>
        <td><?= htmlentities($monto) ?></td>
        <td><?= htmlentities($modif) ?></td>
        <td><?= $integridad ?></td>
        <td><a href="?ver=<?= urlencode($token) ?>">Ver</a></td>
        <td><a class="btn btn-delete" href="?delete=<?= urlencode($token) ?>" onclick="return confirm('¿Eliminar archivo de este token?')">Eliminar</a></td>
    </tr>
<?php endforeach; ?>
</table>
<?php if (empty($archivos)): ?>
<p>No hay archivos temporales de agendamiento.</p>
<?php endif; ?>

<?php
// Ver detalle si lo pide el usuario
if (isset($_GET['ver'])):
    $verToken = $_GET['ver'];
    if (preg_match('/^[a-zA-Z0-9]+$/', $verToken)) {
        $fileVer = $dir . "/tmp_datosform_$verToken.json";
        if (file_exists($fileVer)) {
            $contenidos = file_get_contents($fileVer);
            echo "<h3>Detalle del archivo: tmp_datosform_$verToken.json</h3>";
            echo "<pre>" . htmlentities($contenidos) . "</pre>";
        } else {
            echo "<div class='msg'>No existe ese archivo.</div>";
        }
    }
endif;
?>

<div class="small">Panel diagnóstico generado por QodoAI &mdash; <?= date("d-m-Y H:i") ?>.</div>
</body>
</html>