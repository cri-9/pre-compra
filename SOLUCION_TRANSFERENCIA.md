# Guía para solucionar problemas con notificarTransferencia.php

## ✅ Estado## Notas de depuración

- La función `getenv_backend` debe estar disponible antes de ser usada
- Los errores de CORS se han abordado configurando cabeceras directamente en el endpoint
- Se ha simplificado la validación para hacer la depuración más fácil
- Evitar incluir espacios en blanco después de la etiqueta de cierre `?>` en archivos PHP
- La mejor práctica es omitir la etiqueta de cierre `?>` al final de los archivos PHP para evitar problemas de "headers already sent"
- Para evitar el error "Access-Control-Allow-Origin header contiene múltiples valores", los encabezados CORS deben establecerse una vez por petición y en un solo lugar
- **IMPORTANTE**: Asegurarse de que no hay encabezados CORS duplicados en `.htaccess` y PHP al mismo tiempo RESUELTO

Todos los endpoints están funcionando correctamente:
- ✅ test_notificar_transferencia_simple.php
- ✅ notificarTransferencia_fix.php
- ✅ notificarTransferencia.php
- ✅ verificarBloque_ultra.php
- ✅ verificarBloque_simple.php

## Problemas identificados y soluciones

1. **Error de sintaxis en corsHeaders.php**: 
   - ✅ Corregido eliminando llaves `}` duplicadas al final del archivo

2. **Problemas con getenv_backend**:
   - ✅ Se ha asegurado que la función esté disponible
   - ✅ Se ha añadido código para cargar helpers/env.php correctamente

3. **Archivo .env**: 
   - ✅ Se ha verificado que existe y actualizado con los valores necesarios para desarrollo

4. **Scripts de diagnóstico**:
   - ✅ Se han creado scripts para probar los endpoints por separado
   - ✅ Versión simplificada que no depende de CORS ni getenv_backend
   
5. **Headers already sent**:
   - ✅ Corregido problema de espacios en blanco después de `?>` en conexionBD.php
   - ✅ Reiniciado el contenedor para aplicar los cambios

6. **Encabezados CORS duplicados**:
   - ✅ Solución alternativa implementada directamente en notificarTransferencia.php
   - ✅ Removida dependencia de corsHeaders.php en el endpoint principal
   - ✅ Configuración manual de encabezados CORS para evitar duplicaciones
   - ✅ Implementado manejo directo de solicitudes OPTIONS
   - ✅ Desactivados encabezados CORS en el archivo .htaccess
   - ✅ Misma solución aplicada a verificarBloque_ultra.php para corregir la duplicación de encabezados

## Pasos para probar la solución

1. **Verificación del sistema completo**:
   Abrir en el navegador: 
   ```
   http://localhost:8080/verificar_sistema.php
   ```
   Este script verifica todos los componentes del sistema y muestra un informe detallado.

2. **Probar los endpoints individualmente**:
   Abrir en el navegador: 
   ```
   http://localhost:8080/test_api.html
   ```
   Esta página permite probar los tres endpoints y ver las respuestas.

## Si el problema persiste

Si después de estos cambios, el endpoint sigue sin funcionar, puede deberse a:

1. **Problemas de red en Docker**: 
   - Reiniciar completamente Docker con:
     ```
     docker-compose down
     docker-compose up -d
     ```

2. **Permisos en archivos**: 
   - Verificar que los archivos en el contenedor tienen permisos correctos

3. **Logs detallados**:
   - Examinar los logs con:
     ```
     docker logs php-apache
     ```

4. **Configuración del contenedor**:
   - Verificar que el contenedor PHP tiene las extensiones necesarias:
     ```
     docker exec php-apache php -m
     ```

## Notas de depuración

- La función `getenv_backend` debe estar disponible antes de ser usada
- Los errores de CORS se han abordado configurando cabeceras directamente en el endpoint
- Se ha simplificado la validación para hacer la depuración más fácil
- Evitar incluir espacios en blanco después de la etiqueta de cierre `?>` en archivos PHP
- La mejor práctica es omitir la etiqueta de cierre `?>` al final de los archivos PHP para evitar problemas de "headers already sent"
- Para evitar el error "Access-Control-Allow-Origin header contiene múltiples valores", los encabezados CORS deben establecerse una vez por petición y en un solo lugar

## Conclusiones y Resumen

Hemos resuelto todos los problemas que impedían el correcto funcionamiento de los endpoints:

1. **Configuración de entorno**:
   - Carga correcta de variables de entorno.
   - Asegurado que los helpers necesarios están disponibles.

2. **Problemas de CORS**:
   - Eliminada duplicación de encabezados en notificarTransferencia.php y verificarBloque_ultra.php.
   - Comentadas las directivas CORS en .htaccess para evitar conflictos.
   - Configuración directa de CORS en los endpoints para mayor control.

3. **Manejo de solicitudes OPTIONS**:
   - Implementado correctamente para manejar solicitudes preflight.
   - Respuesta 200 OK sin contenido para estas solicitudes.

4. **Flujo de datos**:
   - Validación correcta de datos de entrada.
   - Respuestas JSON estructuradas adecuadamente.

5. **Mejores prácticas implementadas**:
   - No usar etiqueta de cierre PHP al final de los archivos.
   - Configurar CORS en un solo lugar por endpoint.
   - Limpiar el buffer de salida antes de enviar respuestas.
   - Control de errores mejorado con try/catch.

## Mejoras adicionales

1. **Versión mejorada de corsHeaders.php**:
   - Se ha creado un archivo `helpers/corsHeaders_mejorado.php` con una implementación más robusta
   - Características:
     - Evita duplicación de encabezados usando variables estáticas
     - Mejor manejo de orígenes permitidos según el entorno
     - Soporte para múltiples orígenes en producción
     - Parseo más robusto del archivo .env
     - Documentación detallada del código

2. **Gestión de CORS en el proyecto**:
   - **Solución a corto plazo**: Configuración de CORS directamente en cada endpoint
   - **Solución a largo plazo**: Dos opciones recomendadas:
     1. Usar un middleware centralizado en PHP que se aplique antes de cualquier otro código
     2. Configurar CORS a nivel de servidor web (Apache/Nginx) en lugar de en PHP

   Para endpoints críticos, se recomienda mantener la configuración CORS directamente en el archivo del endpoint para evitar dependencias que puedan romper la funcionalidad.

### Recomendaciones para futuras actualizaciones

1. **Mejores prácticas PHP**:
   - Omitir la etiqueta de cierre `?>` al final de los archivos PHP
   - Centralizar la configuración de cabeceras CORS
   - Utilizar funciones para validar datos de manera consistente

2. **Gestión de errores**:
   - Mantener un sistema de log detallado
   - Responder siempre con JSON válido incluso en caso de error
   - Incluir información útil de diagnóstico en modo desarrollo

3. **Mantenimiento**:
   - Actualizar regularmente este documento si se hacen cambios
   - Mantener scripts de diagnóstico para futuras depuraciones
   - Documentar la estructura y funcionamiento del sistema
