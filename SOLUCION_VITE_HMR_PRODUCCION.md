# Solución Error Vite HMR WebSocket en Producción

## Problema
Cuando se despliega la aplicación React con Vite en producción (VPS), aparece el siguiente error en la consola del navegador:

```
[vite] failed to connect to websocket.
your current setup:
(browser) visualmecanica.cl/ <--[HTTP]--> localhost:3001/ (server)
(browser) visualmecanica.cl:/ <--[WebSocket (failing)]--> localhost:3001/ (server)
```

## Causa
Vite incluye por defecto un cliente HMR (Hot Module Replacement) que intenta conectarse a un WebSocket en modo desarrollo. En producción, este código sigue presente y trata de conectarse a `localhost:3001`, lo cual falla desde un dominio externo.

## Soluciones Implementadas

### 1. Configuración de Vite (`frontend/vite.config.ts`)
- **Deshabilitar HMR en producción**: `hmr: false` cuando `mode === 'production'`
- **Configuración específica de build**: Definiciones de entorno para `NODE_ENV=production`
- **Limpieza de console.log**: Remover logs en producción con `esbuild.drop`

### 2. Script en HTML (`frontend/index.html`)
- **Interceptación de WebSocket**: Sobrescribe la clase `WebSocket` para bloquear conexiones de Vite
- **Filtrado de advertencias**: Silencia mensajes de error relacionados con Vite HMR
- **Detección automática**: Solo se activa en producción

### 3. Dockerfile de Producción (`frontend/Dockerfile.prod`)
- **Variable de entorno**: `ENV NODE_ENV=production` antes del build
- **Build optimizado**: Construcción específica para producción

## Archivos Modificados

1. **`frontend/vite.config.ts`**
   ```typescript
   export default defineConfig(({ command, mode }) => {
     const isProduction = mode === 'production';
     return {
       server: {
         hmr: !isProduction ? { port: 3001, host: '0.0.0.0' } : false
       },
       // ... más configuraciones
     };
   });
   ```

2. **`frontend/index.html`**
   - Script que intercepta WebSocket y bloquea conexiones de Vite
   - Filtros para console.warn

3. **`frontend/Dockerfile.prod`**
   - `ENV NODE_ENV=production` antes del build

## Scripts de Implementación

- **`fix-vite-hmr-production.bat`**: Aplica la solución completa
- **`verify-vite-fix.bat`**: Verifica que la solución funcione

## Uso

1. Ejecutar el script de corrección:
   ```bash
   fix-vite-hmr-production.bat
   ```

2. Verificar la solución:
   ```bash
   verify-vite-fix.bat
   ```

3. Comprobar en navegador:
   - Ir a https://visualmecanica.cl
   - Abrir DevTools (F12)
   - Verificar que no aparezcan errores de WebSocket de Vite

## Resultado Esperado
- ✅ La página carga sin errores de WebSocket
- ✅ No aparecen mensajes de HMR en la consola
- ✅ La funcionalidad de la aplicación permanece intacta
- ✅ WebSockets legítimos siguen funcionando

## Notas Adicionales
- Esta solución es específica para producción y no afecta el desarrollo local
- Los WebSockets normales de la aplicación siguen funcionando
- La configuración es compatible con diferentes versiones de Vite
- Se recomienda limpiar la caché del navegador después de implementar los cambios
