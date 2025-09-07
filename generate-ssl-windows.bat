@echo off
REM Script para generar certificados SSL en Windows usando PowerShell
REM Alternativa cuando OpenSSL no está disponible

echo Generando certificados SSL autofirmados para desarrollo...

REM Crear directorio SSL si no existe
if not exist "nginx\ssl" mkdir "nginx\ssl"

REM Usar PowerShell para generar certificado autofirmado
powershell.exe -ExecutionPolicy Bypass -Command ^
"try { ^
    $cert = New-SelfSignedCertificate -DnsName 'visualmecanica.cl', 'www.visualmecanica.cl' -CertStoreLocation 'Cert:\LocalMachine\My' -KeyUsage DigitalSignature,KeyEncipherment -KeyAlgorithm RSA -KeyLength 2048 -NotAfter (Get-Date).AddDays(365) -Subject 'CN=visualmecanica.cl'; ^
    $certPath = 'nginx\ssl\visualmecanica.cl.crt'; ^
    $keyPath = 'nginx\ssl\visualmecanica.cl.key'; ^
    $bytes = $cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert); ^
    [System.IO.File]::WriteAllBytes($certPath, $bytes); ^
    Write-Host 'Certificado generado: ' $certPath; ^
    Write-Host 'NOTA: La clave privada se maneja internamente por Windows'; ^
    Write-Host 'Para Docker, se necesitará configuración adicional'; ^
} catch { ^
    Write-Host 'Error generando certificados: ' $_.Exception.Message; ^
}"

echo.
echo ✅ Proceso completado
echo NOTA: En Windows, los certificados autofirmados requieren configuración especial
echo Para desarrollo local, considera usar certificados de Let's Encrypt o mkcert
