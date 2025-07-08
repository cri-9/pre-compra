<?php
// rateLimiter.php
// Limita 60 peticiones por IP por minuto

function rateLimit($limit = 60, $window = 60) {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $time = time();
    $key = md5($ip . date('YmdHi')); // por minuto
    $rateFile = sys_get_temp_dir() . "/rate_$key";

    if (file_exists($rateFile)) {
        $data = json_decode(file_get_contents($rateFile), true);
        if ($data['count'] >= $limit) {
            header('HTTP/1.1 429 Too Many Requests');
            die('Demasiadas peticiones, espera un momento...');
        } else {
            $data['count']++;
            file_put_contents($rateFile, json_encode($data));
        }
    } else {
        $data = ['count' => 1, 'time' => $time];
        file_put_contents($rateFile, json_encode($data));
    }
}

// Mantener compatibilidad con código existente
$rateLimit = 60;
$rateWindow = 60; // segundos

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$time = time();
$key = md5($ip . date('YmdHi')); // por minuto
$rateFile = sys_get_temp_dir() . "/rate_$key";

if (file_exists($rateFile)) {
    $data = json_decode(file_get_contents($rateFile), true);
    if ($data['count'] >= $rateLimit) {
        header('HTTP/1.1 429 Too Many Requests');
        die('Demasiadas peticiones, espera un momento...');
    } else {
        $data['count']++;
        file_put_contents($rateFile, json_encode($data));
    }
} else {
    $data = ['count' => 1, 'time' => $time];
    file_put_contents($rateFile, json_encode($data));
}
?>