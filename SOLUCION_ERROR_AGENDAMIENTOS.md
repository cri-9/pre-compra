# Solución al Error: Table 'visualmecanica_prod.agendamientos' doesn't exist

## 🔍 Problema Identificado

El error indica que la tabla `agendamientos` no existe en la base de datos de producción (`visualmecanica_prod`), aunque sí existe en desarrollo (`precompra_db`).

### Diferencias entre entornos:
- **Desarrollo**: Base de datos `precompra_db` - ✅ Tabla existe
- **Producción**: Base de datos `visualmecanica_prod` - ❌ Tabla NO existe

## 🛠️ Soluciones Disponibles

### Opción 1: Ejecutar Script PHP (Recomendado)

Ejecuta el script de reparación desde el navegador o línea de comandos:

```bash
# Desde el navegador
https://visualmecanica.cl/Backend/fix_production_database.php

# O desde línea de comandos en el servidor
php Backend/fix_production_database.php
```

Este script:
- ✅ Verifica si las tablas existen
- ✅ Crea las tablas faltantes automáticamente
- ✅ Inserta datos de ejemplo
- ✅ Verifica que todo funcione correctamente

### Opción 2: Ejecutar SQL Directamente

Si tienes acceso a phpMyAdmin o MySQL directamente:

1. Conecta a la base de datos `visualmecanica_prod`
2. Ejecuta el archivo `create_production_tables.sql`

### Opción 3: Recrear Contenedores Docker

Si usas Docker, puedes recrear los contenedores para que se ejecute el `init-db.sql` actualizado:

```bash
# Detener contenedores
docker-compose -f docker-compose.prod.yml down

# Eliminar volúmenes de base de datos (CUIDADO: esto borra todos los datos)
docker volume rm pre-compra_mysql_data

# Recrear contenedores
docker-compose -f docker-compose.prod.yml up -d
```

## 🧪 Verificación

Para verificar que la solución funcionó:

```bash
# Ejecutar script de verificación
https://visualmecanica.cl/Backend/verify_production_database.php
```

O probar directamente el endpoint que estaba fallando:

```bash
curl -X POST https://visualmecanica.cl/Backend/verificarBloque.php \
  -H "Content-Type: application/json" \
  -d '{"fecha":"2024-07-15"}'
```

Respuesta esperada:
```json
{
  "success": true,
  "disponibles": ["AM", "PM"]
}
```

## 📋 Estructura de Tablas Creadas

### Tabla `agendamientos`
- `id` - Clave primaria
- `fecha_agendada` - Fecha del agendamiento
- `bloque` - AM/PM
- `horario` - Hora específica
- `nombre_cliente`, `apellido_cliente` - Datos del cliente
- `email_cliente`, `telefono_cliente` - Contacto
- `marca_vehiculo`, `modelo_vehiculo`, `anio_vehiculo` - Datos del vehículo
- `patente` - Patente del vehículo
- `servicios_seleccionados` - JSON con servicios
- `estado` - Estado del agendamiento
- `monto_total`, `metodo_pago`, `estado_pago` - Datos de pago
- Timestamps de creación y actualización

### Tabla `cotizaciones`
- Estructura similar para cotizaciones

### Tabla `pagos`
- Gestión de pagos y transferencias
- Relaciones con agendamientos y cotizaciones

## 🔧 Prevención Futura

Para evitar este problema en el futuro:

1. **Sincronizar esquemas**: Mantén los archivos SQL actualizados
2. **Usar migraciones**: Implementa un sistema de migraciones
3. **Verificar antes de deploy**: Ejecuta scripts de verificación
4. **Backup regular**: Mantén respaldos de la estructura de BD

## 📞 Soporte

Si el problema persiste:

1. Verifica la conexión a la base de datos
2. Confirma que el usuario tiene permisos
3. Revisa los logs de error del servidor
4. Ejecuta el script de verificación para diagnóstico completo

## ✅ Checklist de Solución

- [ ] Ejecutar `fix_production_database.php`
- [ ] Verificar con `verify_production_database.php`
- [ ] Probar endpoint `verificarBloque.php`
- [ ] Confirmar que la aplicación funciona sin errores
- [ ] Documentar la solución aplicada