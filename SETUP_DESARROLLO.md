# Configuración de Desarrollo - Pre-Compra

## ✅ Configuración Completada

### 1. Configuración del Backend (PHP)
- **Archivo `.env`**: Configurado para desarrollo local
- **Base de datos**: Configurada para usar `precompra_db` en localhost
- **WebPay**: Configurado en modo integración (pruebas)
- **Dependencias**: Instaladas con Composer
- **CORS**: Configurado automáticamente para desarrollo/producción

### 2. Configuración del Frontend (React/Vite)
- **Archivo `.env`**: Configurado para desarrollo local
- **Dependencias**: Instaladas con npm
- **Servidor**: Corriendo en puerto 3001 (o 3002 si está ocupado)
- **Configuración**: Ajustada para desarrollo

### 3. Archivos de Configuración
- `Backend/.env` - Variables de entorno del backend
- `.env` - Variables de entorno del frontend  
- `vite.config.ts` - Configuración de Vite corregida
- `Backend/helpers/corsHeaders.php` - Configuración automática de CORS

## 🔧 Problema de CORS Resuelto ✅
Se ha implementado un sistema automático de detección de entorno que:
- **Desarrollo**: Permite conexiones desde localhost en cualquier puerto
- **Producción**: Solo permite conexiones desde https://visualmecanica.cl
- **Archivos actualizados**: enviarCotizacion.php, notificarTransferencia.php, verificarBloque.php, webpay.php, webpayRespuesta.php, agendarTransferencia.php

## 🔧 Acciones Requeridas

### 1. Configurar XAMPP
- Iniciar **Apache** y **MySQL** en XAMPP
- Acceder a phpMyAdmin: http://localhost/phpmyadmin
- Crear base de datos llamada `precompra_db`

### 2. Configurar Email (Opcional)
- Editar `Backend/.env`
- Cambiar `SMTP_USER` y `SMTP_PASS` con tus credenciales de Gmail
- Habilitar contraseña de aplicación en Gmail

### 3. Verificar Conexiones
- Frontend: http://localhost:3001
- Backend test: http://localhost/pre-compra/Backend/test_connection.php

## 📋 Comandos Útiles

### Iniciar desarrollo
```bash
# Terminal 1: Iniciar servidor frontend
npm run dev

# Terminal 2: Verificar XAMPP está corriendo
# Ir a http://localhost/xampp para verificar
```

### Debugging
```bash
# Ver errores de PHP
tail -f C:/xampp/apache/logs/error.log

# Ver logs de la aplicación
# Los logs aparecen en Backend/logs/ si están configurados
```

## 🚀 URL de Desarrollo
- **Frontend**: http://localhost:3001
- **Backend**: http://localhost/pre-compra/Backend
- **phpMyAdmin**: http://localhost/phpmyadmin

## 🔍 Próximos Pasos
1. ✅ Verificar que XAMPP esté corriendo
2. ✅ Crear la base de datos `precompra_db`
3. ✅ Importar el esquema de la base de datos si tienes un backup
4. ✅ Configurar credenciales de email si necesitas funcionalidad de correo
5. ✅ Probar todas las funcionalidades una por una

## 🧪 Pruebas de CORS
- **Archivo de pruebas**: `test_cors.html` - Abre http://localhost:3002/test_cors.html
- **Pruebas automáticas**: Conexión BD, Cotización, Verificar Bloque, WebPay
- **Estado**: ✅ CORS configurado y funcionando

## 📝 Cambios Realizados
### Archivos Creados/Modificados:
- `Backend/helpers/corsHeaders.php` - Sistema automático de CORS
- `Backend/helpers/rateLimiter.php` - Función rateLimit() agregada
- `Backend/test_connection.php` - Prueba de conexión BD
- `test_cors.html` - Página de pruebas de CORS
- Archivos PHP actualizados: enviarCotizacion.php, notificarTransferencia.php, verificarBloque.php, webpay.php, webpayRespuesta.php, agendarTransferencia.php

### Configuración Automática:
- **Desarrollo**: Permite localhost:3001, localhost:3002, localhost:3000
- **Producción**: Solo permite https://visualmecanica.cl
- **Detección automática**: Basada en APP_URL en archivo .env

## 🔧 Archivos de Configuración Mejorados
- `Backend/.env` - Sintaxis limpia sin paréntesis ni comillas en comentarios
- `Backend/.env.backup` - Versión de respaldo limpia
- `Backend/helpers/corsHeaders.php` - Manejo robusto de errores de parsing
- `test_verificar_bloque.html` - Prueba específica para verificar bloques

## 🐛 Problemas Resueltos

### ❌ Error CORS - ✅ SOLUCIONADO
- **Problema**: `Access-Control-Allow-Origin` bloqueaba localhost
- **Solución**: Sistema automático de detección de entorno

### ❌ Error JSON - ✅ SOLUCIONADO  
- **Problema**: PHP devolvía HTML en lugar de JSON
- **Solución**: Headers JSON forzados y manejo de errores

### ❌ Error Base de Datos - ✅ SOLUCIONADO
- **Problema**: Sistema esperaba estructura de tabla diferente
- **Solución**: Adaptado a tu tabla `agendamientos` existente con 77 registros
- **Campos compatibles**: `fecha_agendada`, `bloque`, `nombre_cliente`, `apellido_cliente`, etc.
- **Verificación**: http://localhost/pre-compra/Backend/test_tabla_existente.php

### ❌ Error Localización - ✅ SOLUCIONADO
- **Problema**: react-datepicker no encontraba locale "es"
- **Solución**: Instalación de date-fns y registro de locale

### ❌ Error Props Material-UI - ✅ SOLUCIONADO
- **Problema**: Props `error` de tipo string en lugar de boolean
- **Solución**: Uso de `!!` para convertir strings a boolean
- **Archivo**: `DatosCliente.jsx` línea 275
- **Guía**: `MEJORES_PRACTICAS_ERROR_PROPS.md`

### ❌ Error Archivo .env - ✅ SOLUCIONADO
- **Problema**: Sintaxis error en .env por paréntesis en comentarios
- **Error**: `syntax error, unexpected '(' in .env on line 10`
- **Solución**: Eliminados paréntesis y comillas de comentarios
- **Mejora**: Manejo robusto de errores en corsHeaders.php

## 🧪 Archivos de Prueba Creados
- `Backend/test_tabla_existente.php` - Análisis de tu tabla existente
- `Backend/setup_database.php` - Configuración automática de BD (actualizado)
- `Backend/test_verificar_bloque.php` - Prueba específica de bloques
- `test_cors.html` - Página de pruebas interactivas
- `database_setup.sql` - Script SQL manual (opcional)

## 📊 Tu Base de Datos Actual
- **Tabla**: `agendamientos` (ya existente)
- **Registros**: 77 agendamientos
- **Estructura**: Completa con campos de cliente, vehículo, vendedor
- **Compatibilidad**: ✅ Totalmente compatible con el sistema

## ✅ SIMULACIÓN DE SERVICIOS EXTERNOS PARA DESARROLLO

### 📧 Simulación de Correo Electrónico
Para evitar errores de SMTP en desarrollo, el sistema puede simular el envío de correos:

```env
# En Backend/.env
DEV_MODE=true
SIMULATE_EMAIL=true
```

**Comportamiento:**
- ✅ **Simulado**: Los correos no se envían realmente, pero se logea la información
- ✅ **Sin errores**: No falla por credenciales SMTP incorrectas
- ✅ **Respuesta exitosa**: Devuelve `success: true` con flag `simulated: true`

### 📅 Simulación de Google Calendar
Para evitar errores de Google Calendar API en desarrollo:

```env
# En Backend/.env
DEV_MODE=true
SIMULATE_CALENDAR=true
```

**Comportamiento:**
- ✅ **Simulado**: Los eventos no se crean realmente en Google Calendar
- ✅ **Sin errores**: No falla por tokens expirados o credenciales incorrectas
- ✅ **Respuesta exitosa**: Devuelve `success: true` con flag `simulated: true`
- ✅ **Consultas libres**: Las consultas de disponibilidad siempre retornan "libre"

### 🔧 Archivos Modificados para Simulación
- `Backend/enviarCorreo.php`: Detecta modo desarrollo y simula envío
- `Backend/agregarEvento.php`: Simula creación de eventos en Google Calendar
- `Backend/estaBloqueOcupadoEnGoogleCalendar.php`: Simula consultas de disponibilidad
- `Backend/notificarTransferencia.php`: Integra ambas simulaciones

### 🎯 Valores Aceptados para Variables de Entorno
El sistema acepta múltiples valores para activar la simulación:
- `true`, `1`, `yes`, `on` (cualquiera de estos activa la simulación)
- `false`, `0`, `no`, `off` (cualquiera de estos desactiva la simulación)

### 📋 Flujo de Pago con Transferencia - Simulado
Con la simulación activada, el proceso de pago con transferencia:

1. ✅ **Guarda los datos** en la base de datos
2. ✅ **Simula el envío** del correo al cliente
3. ✅ **Simula el envío** del correo a la empresa
4. ✅ **Simula la creación** del evento en Google Calendar
5. ✅ **Retorna éxito** con flags `simulated: true` para cada servicio

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Solicitud registrada correctamente. Revisa tu correo para más detalles.",
  "mail": {
    "success": true,
    "simulated": true
  },
  "calendar": {
    "success": true,  
    "simulated": true
  }
}
```

### 🧪 Archivo de Prueba
- `test_pago_transferencia.html`: Formulario para probar el proceso completo
- `Backend/test_simulacion.php`: Script para probar funciones individuales

---

¡Tu proyecto está listo para desarrollo! 🎉
