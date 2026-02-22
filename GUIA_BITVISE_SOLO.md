# ✅ DEPLOYMENT SOLO CON BITVISE (Sin PuTTY)

**Fecha:** 21 de febrero de 2026  
**Opción:** Más práctica y simple - Una sola aplicación

---

## 🎯 INFORMACIÓN CLAVE

**SÍ, puedes usar solo Bitvise** sin descargar PuTTY separado.

Bitvise tiene **dos tabs integrados:**
- 🔵 **SFTP** - Gestor gráfico de archivos (Drag & drop)
- ⚫ **TERMINAL** - Línea de comandos (mkdir, cp, npm run build)

**Ambos en la misma ventana, cambias de tab según necesites.**

---

## 📥 DESCARGA

```
Descarga solo: https://www.bitvise.com/download

NO necesitas PuTTY :)
```

---

## 🚀 FLUJO COMPLETO OPCIÓN 2 (Solo Bitvise)

### PASO 1: Conectar Bitvise

```
1. Abre Bitvise SSH Client

2. Pantalla de conexión:
   Host: [Tu IP del VPS]
   Port: 22
   Username: visualmecanica
   Password: [Tu contraseña]

3. Click: "Connect"

4. Verás la ventana principal con 2 tabs:
   - SFTP (a la izquierda)
   - TERMINAL (a la derecha)
```

---

### PASO 2: Hacer respaldos (Tab TERMINAL)

```
1. Click en tab: TERMINAL

2. Escribir comando para cambiar a root:
   su -
   (Ingresa contraseña de root)

3. Copia y pega esto:
   cd /home/visualmecanica/frontend/src/components
   mkdir backup_21feb2026
   cp *.jsx backup_21feb2026/
   cp *.tsx backup_21feb2026/

4. Verifica:
   ls -la backup_21feb2026/ | wc -l

5. Debe mostrar un número (cantidad de archivos)
   ✅ Listo
```

---

### PASO 3: Subir componentes (Tab SFTP)

```
1. Click en tab: SFTP

2. En el panel izquierdo (del VPS), navega a:
   /home/visualmecanica/frontend/src/components/

3. Elimina archivos viejos:
   - Click derecho en *.jsx → Delete
   - Click derecho en *.tsx → Delete

4. Sube componentes nuevos:
   - Abre explorador local (derecha): 
     c:\Users\Users\desarrollo_aplicaciones\pre-compra\frontend\src\components\
   
   - Selecciona 38 archivos
   
   - Drag & drop a panel izquierdo (del VPS)
   
   - O copy/paste entre paneles

5. Espera a que termine (muestra progreso)
   ✅ Listo
```

---

### PASO 4: Subir CSS (Tab SFTP)

```
1. En tab SFTP, navega a:
   /home/visualmecanica/frontend/src/Csspersonalizado/

2. Elimina *.css viejos (click derecho → Delete)

3. Sube 8 CSS nuevos (Drag & drop):
   c:\...\frontend\src\Csspersonalizado\

✅ Listo
```

---

### PASO 5: Subir imágenes (Tab SFTP)

```
1. Navega a: /home/visualmecanica/frontend/src/assets/

2. Sube carpeta por carpeta (Drag & drop):
   
   a) img_prin_dpf/ (8 imágenes) - 2 min
   b) img_tpms/ (video + 3 imágenes) - 10-15 min ⏳ LENTO
   c) img_menu_superior_tpms/ (1 archivo) - 2 min
   d) Resto de carpetas - 10 min

✅ Listo
```

---

### PASO 6: Subir SEO files (Tab SFTP)

```
1. Navega a: /home/visualmecanica/frontend/

2. Sube 2 archivos (Drag & drop):
   - sitemap.xml
   - robots.txt

✅ Listo
```

---

### PASO 7: Hacer BUILD (Tab TERMINAL)

```
1. Click en tab: TERMINAL

2. Asegúrate de estar como root (si no, ejecuta: su -)

3. Copia y pega:
   cd /home/visualmecanica/frontend
   npm install
   npm run build

4. ⏳ ESPERA 10-15 minutos hasta que veas:
   "✓ built in XX.XXs"

5. Cuando termine, ejecuta:
   sudo chown -R visualmecanica:visualmecanica dist/
   sudo chmod -R 755 dist/
   sudo systemctl restart nginx

6. Verifica en navegador:
   https://visualmecanica.cl/dpf
   https://visualmecanica.cl/tpms
   
   Ambas deben cargar ✅
```

---

## 📊 RESUMEN VISUAL

```
┌─────────────────────────────────────┐
│         BITVISE SSH CLIENT          │
├─────────────┬───────────────────────┤
│             │                       │
│   TERMINAL  │      SFTP             │
│ (Comandos)  │   (Archivos)          │
│             │                       │
│ Paso 2: su-  │ Paso 3: Drag & drop  │
│ Paso 2: mkdir │ componentes        │
│ Paso 2: cp   │ Paso 4: Drag & drop │
│ Paso 7: npm  │ CSS                 │
│ Paso 7: build │ Paso 5: Drag & drop│
│ Paso 7: chmod │ imágenes          │
│ Paso 7: sudo │ Paso 6: Drag & drop│
│ Paso 7: nginx │ sitemap/robots   │
│             │                      │
└─────────────┴───────────────────────┘
```

---

## ⏱️ TIMELINE

| Paso | Herramienta | Tiempo |
|------|-------------|--------|
| 1 | Conexión | 1 min |
| 2 | TERMINAL | 2 min |
| 3 | SFTP | 5 min |
| 4 | SFTP | 1 min |
| 5 | SFTP | 20 min |
| 6 | SFTP | 1 min |
| 7 | TERMINAL | 15 min |
| **TOTAL** | | **45 min** |

---

## ✅ VERIFICACIÓN FINAL

En la terminal de Bitvise (tab TERMINAL), ejecuta:

```bash
# Ver carpeta dist creada
ls -la /home/visualmecanica/frontend/dist/ | head -20

# Contar archivos en assets
ls -la /home/visualmecanica/frontend/dist/assets/ | wc -l
# Debe mostrar 80+

# Probar DPF
curl -I https://visualmecanica.cl/dpf
# Debe mostrar: HTTP/2 200

# Probar TPMS
curl -I https://visualmecanica.cl/tpms
# Debe mostrar: HTTP/2 200
```

---

## 🎯 DIFERENCIA: Tab TERMINAL vs SFTP

| Tarea | Tab |
|-------|-----|
| mkdir, cp, ls, cd | TERMINAL |
| npm run build | TERMINAL |
| sudo chmod | TERMINAL |
| sudo systemctl | TERMINAL |
| Drag & drop archivos | SFTP |
| Crear carpetas gráficamente | SFTP |
| Eliminar archivos | SFTP |
| Ver árbol de carpetas | SFTP |

---

## ⚠️ COMANDO IMPORTANTE EN TERMINAL

Si necesitas cambiar de usuario en TERMINAL:

```bash
# Cambiar a root (si conectaste como visualmecanica)
su -
# Ingresa contraseña root

# Volver a usuario anterior
exit
```

---

## 🚨 SI ALGO FALLA

### En tab TERMINAL:

```bash
# Ver últimos errores
tail -f /var/log/nginx/error.log

# Ver acceso
tail -f /var/log/nginx/access.log

# Reiniciar manualmente
sudo systemctl stop nginx
sudo systemctl start nginx

# Verificar estado
sudo systemctl status nginx
```

---

## 📋 ARCHIVO RECOMENDADO ANTES DE EMPEZAR

Abre este archivo en otra ventana para referencia:
**INSTRUCCIONES_DEPLOYMENT_VPS.md** (en el proyecto)

Tiene más detalles si necesitas aclaraciones.

---

**Generado:** 21 de febrero de 2026  
**Aplicación:** Solo Bitvise  
**Complejidad:** Baja  
**Status:** ✅ LISTO PARA USAR

👉 **Descarga Bitvise:** https://www.bitvise.com/download
