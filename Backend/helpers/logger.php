<?php
// logger.php
function logError($message) {
    $date = date('Y-m-d H:i:s');
    $logFile = __DIR__.'/../logs/error.log';

    if (!file_exists(dirname($logFile))) {
        mkdir(dirname($logFile), 0775, true);
    }

    $msg = "[$date] $message" . PHP_EOL;
    error_log($msg, 3, $logFile);
}

// Ejemplo de uso:
// try { ... }
// catch (Exception $e) {
//     logError($e->getMessage());
// }
?>