# INSTRUCCIONES DE DEPLOYMENT EN VPS - PASO A PASO
**Fecha:** 21 de febrero de 2026  
**Versión:** Build Final - Listo para producción

---

## 📋 RESUMEN RÁPIDO

✅ **Estado:** Build completado exitosamente  
✅ **Dist:** Generado con 12,394 módulos (53.31 segundos)  
✅ **Componentes:** 38 archivos actualizados  
✅ **CSS:** 8 archivos optimizados  
✅ **Imágenes:** 80+ archivos optimizados  
✅ **SEO:** Sitemap y robots.txt actualizados  
✅ **Documentación:** 4 archivos de referencia  

---

## 📁 ARCHIVOS DISPONIBLES LOCALMENTE

### Documentación de referencia:
1. **RESUMEN_ACTUALIZACIONES_21FEB2026.md** - Resumen ejecutivo completo
2. **LISTA_ARCHIVOS_SUBIR_BITVISE.md** - Lista detallada para upload SFTP
3. **CARPETAS_IMAGENES_DPF_TPMS.md** - Análisis de imágenes DPF y TPMS
4. **ANALISIS_SEO_SITEMAP_ROBOTS.md** - Validación de SEO

### Carpeta compilada:
- **frontend/dist/** - Build listo para deploy

---

## ⚠️ RECOMENDACIÓN

**✅ ELIGE OPCIÓN 2** (Upload componentes + build en VPS)  
**Razón:** Actualiza TODOS los cambios (componentes, CSS, imágenes, DPF/TPMS)  
**Tiempo:** 45-60 minutos  

**Opción 1 solo si:** Necesitas deploy de emergencia sin cambios adicionales

---

## �️ HERRAMIENTAS NECESARIAS PARA OPCIÓN 2

Antes de comenzar, descarga e instala:

```
1. PuTTY (Terminal SSH)
   Descargar: https://www.putty.org/
   Función: Ejecutar comandos mkdir, cp, npm run build, etc.
   Usuario: root

2. Bitvise SSH Client (Incluye gestor SFTP gráfico)
   Descargar: https://www.bitvise.com/download
   Función: Subir archivos con Drag & Drop
   Usuario: visualmecanica
```

**Ambas se usan SIMULTÁNEAMENTE durante el deployment**

---

## �🚀 OPCIÓN 1: SUBIR DIST COMPILADO VÍA SFTP (Más rápido - 10 min)

### Para usar SOLO en caso de emergencia (sin cambios adicionales):

```bash
1. Conectar a VPS vía Bitvise SFTP
   Host: [IP_VPS]
   Puerto: 22
   Usuario: visualmecanica

2. Navegar a: /home/visualmecanica/frontend/

3. Respaldar dist actual:
   mv dist dist_backup_21feb2026

4. Subir nueva carpeta dist:
   Drag & drop: c:\Users\Users\desarrollo_aplicaciones\pre-compra\frontend\dist

5. Esperar a que termine (5-10 minutos)

6. En terminal del VPS:
   # Cambiar propietario
   sudo chown -R visualmecanica:visualmecanica /home/visualmecanica/frontend/dist
   sudo chmod -R 755 /home/visualmecanica/frontend/dist
```

---

## 🔧 OPCIÓN 2: SUBIR COMPONENTES Y HACER BUILD EN VPS (Recomendado - 60 min)

**✅ ESTA ES LA OPCIÓN RECOMENDADA**

Actualiza TODO: componentes, CSS, imágenes, DPF/TPMS compilados correctamente.

### Instrucciones detalladas:

**IMPORTANTE:** Mantén ABIERTOS DOS PROGRAMAS SIMULTÁNEAMENTE:

```
Programa 1: 🔵 Bitvise SFTP (Gestor de archivos gráfico)
            Usuario: visualmecanica
            Función: Subir componentes, CSS, imágenes

Programa 2: ⚫ PuTTY SSH (Terminal de comandos)
            Usuario: root
            Función: Hacer respaldos, mkdir, cp, build
```

#### PASO 1: Preparar upload de componentes

**Paso 1A: Hacer respaldos (⚫ TERMINAL EN BITVISE O PUTTY)**

⭐ **OPCIÓN 1 (MÁS PRÁCTICA):** Usa la terminal integrada de Bitvise
```bash
# En Bitvise, ve a: TERMINAL tab (está arriba de SFTP)
# Copia y pega estos comandos:

# Cambiar a usuario root (si está como visualmecanica):
su -
# Ingresa contraseña root

# Ahora ejecuta:
cd /home/visualmecanica/frontend/src/components
mkdir backup_21feb2026
cp *.jsx backup_21feb2026/
cp *.tsx backup_21feb2026/

# Verifica:
ls -la backup_21feb2026/ | wc -l
# Debe mostrar un número (cantidad de archivos respaldados)

# Listo
exit
```

**OPCIÓN 2 (Alternativa):** Usa PuTTY como programa separado
```bash
# Abre PuTTY y conecta como root:
ssh root@[IP_VPS]

# Ejecuta lo mismo:
cd /home/visualmecanica/frontend/src/components
mkdir backup_21feb2026
cp *.jsx backup_21feb2026/
cp *.tsx backup_21feb2026/

exit
```

**Paso 1B: Subir nuevos componentes (🔵 BITVISE SFTP - Tab gráfico)**

Después de ejecutar los comandos anteriores, cambia al tab SFTP en Bitvise:

```
1. En Bitvise, abre el tab: SFTP (está al lado de TERMINAL)
   
2. Si no estás conectado al SFTP, conecta:
   Abre el lado izquierdo (carpetas)
   Host: [IP_VPS]
   Usuario: visualmecanica
   
3. Navega a: /home/visualmecanica/frontend/src/components/

4. Elimina archivos viejos:
   - Selecciona *.jsx
   - Click derecho → Delete
   - Selecciona *.tsx
   - Click derecho → Delete
   
5. Sube 38 componentes nuevos:
   Fuente PC: c:\Users\Users\desarrollo_aplicaciones\pre-compra\frontend\src\components\
   Método: Drag & drop o copy/paste en Bitvise
   
6. Espera confirmación (muestra progreso)
```
   
   Archivos principales a subir:
   - DPFPage.jsx ⭐ NUEVO
   - TPMSPage.jsx ⭐ NUEVO
   - LandingPage.tsx ⭐ ACTUALIZADO
   - LandingPage.jsx ⭐ ACTUALIZADO
   - ServiceCards.tsx ⭐ ACTUALIZADO
   - FormularioContacto.tsx ⭐ ACTUALIZADO
   - SEO.tsx ⭐ NUEVO
   - Navbar.jsx ⭐ ACTUALIZADO
   - (y resto de componentes)
```

#### PASO 2: Subir CSS actualizado

**Paso 2A: Hacer backup de CSS (⚫ TERMINAL SSH - PuTTY)**

```bash
# Abre PuTTY y conecta como root:
# Host: [IP_VPS], Usuario: root

# Ejecuta comandos:
cd /home/visualmecanica/frontend/src/Csspersonalizado/
mkdir backup_css_21feb2026
cp *.css backup_css_21feb2026/

# Verifica:
ls backup_css_21feb2026/ | wc -l
# Debe mostrar 8 (cantidad de archivos respaldados)

# Cierra PuTTY
exit
```

**Paso 2B: Subir CSS (🔵 BITVISE SFTP - Programa gráfico)**

```
1. Abre Bitvise SFTP (ya debe estar en otra ventana)
   Usuario: visualmecanica

2. Navega a: /home/visualmecanica/frontend/src/Csspersonalizado/

3. Elimina *.css viejos:
   Selecciona todos
   Click derecho → Delete

4. Sube 8 archivos CSS nuevos:
   Fuente: c:\Users\Users\desarrollo_aplicaciones\pre-compra\frontend\src\Csspersonalizado\
   Método: Drag & drop
   Espera confirmación
```

4. Archivos a subir:
   - Botones_RRSS.css
   - FechaAgendamientoModerno.css
   - landingpage.css ⭐ ACTUALIZADO
   - Navbar.css ⭐ ACTUALIZADO
   - PortadaTrabajos.css
   - subcri_footer.css
   - Testimonios.css
   - Testimonios_clean.css
```

#### PASO 3: Subir imágenes actualizadas

**Solo VÍA BITVISE SFTP (no necesita comandos SSH)**

```
1. En Bitvise SFTP, navegar a:
   /home/visualmecanica/frontend/src/assets/

2. IMÁGENES CRÍTICAS (subir primero):
   
   a) Carpeta: img_prin_dpf/
      Subir 8 imágenes (Drag & drop):
      - img_dpf_pro_1.png
      - img_dpf_pro_2.jpg
      - img_dpf_pro_3.jpg
      - img_dpf_pro_4.jpg
      - img_dpf_pro_5.jpg
      - img_dpf_pro_6.png
      - img_dpf_pro_7.jpg
      - img_dpf_pro_8.jpg
      (Tamaño: ~1 MB, Tiempo: ~2 min)
   
   b) Carpeta: img_tpms/
      Subir 4 archivos en este orden:
      - tpms_presion_llanta.png (71 kB) - rápido
      - img_tpms_que_es.png (2.3 MB) - esperar
      - img_tpms_que_es_3.png (2.5 MB) - esperar
      - img_cuerpo.mp4 (9.6 MB) - ESPERAR MÁS (crítico)
      ⚠️ Total: ~14.5 MB, Tiempo: ~10-15 min
   
   c) Carpeta: img_menu_superior_tpms/
      Subir 1 archivo:
      - img_banner_menu.webp (799 kB)
      Tiempo: ~2 min

3. IMÁGENES GENERALES (resto de carpetas):
   Subir carpeta por carpeta el resto de imágenes
   (19 carpetas total, Tiempo: ~10 min)
```

#### PASO 4: Subir archivos SEO

**Solo VÍA BITVISE SFTP**

```
1. En Bitvise SFTP, navegar a:
   /home/visualmecanica/frontend/

2. Subir 2 archivos:
   Fuente: c:\Users\Users\desarrollo_aplicaciones\pre-compra\frontend\
   Destino: /home/visualmecanica/frontend/ (en Bitvise)
   
   Archivos a subir:
   - sitemap.xml ⭐ ACTUALIZADO
   - robots.txt ⭐ ACTUALIZADO
   
   Método: Drag & drop
   Tiempo: ~1 minuto

3. Verificar en navegador (después de hacer build):
   https://visualmecanica.cl/sitemap.xml
   https://visualmecanica.cl/robots.txt
```

#### PASO 5: Compilar en VPS (⚫ TERMINAL SSH - PuTTY COMO ROOT)

**IMPORTANTE:** Este paso se hace en PuTTY terminal SSH, NO en Bitvise SFTP

Después de subir TODOS los archivos (componentes, CSS, imágenes):

```bash
# 1. Abre PuTTY nuevamente como root
ssh root@[IP_VPS]
# Ingresa contraseña

# 2. Ir a carpeta frontend
cd /home/visualmecanica/frontend

# 3. Instalar dependencias (si es primera vez o necesita actualizar)
npm install

# 4. ⏳ HACER BUILD (espera 10-15 minutos)
npm run build

# Verás progreso como:
# "vite v5.4.19 building for production..."
# "✓ 12394 modules transformed"
# "✓ built in 53.31s"

# Cuando aparezca "✓ built", significa que FUNCIONÓ ✅

# 5. Cambiar propietario de dist
sudo chown -R visualmecanica:visualmecanica dist/
sudo chmod -R 755 dist/

# 6. Reiniciar nginx
sudo systemctl restart nginx

# Listo
exit
```

**Verifica que funcionó:**
```bash
# En la misma terminal SSH:
curl -I https://visualmecanica.cl/
# Debe retornar: HTTP/2 200

curl -I https://visualmecanica.cl/dpf
# Debe retornar: HTTP/2 200

curl -I https://visualmecanica.cl/tpms
# Debe retornar: HTTP/2 200
```

---

## ⏱️ TIEMPO ESTIMADO DE EJECUCIÓN

| Tarea | Tiempo |
|-------|--------|
| Subir componentes (38 files) | 5 min |
| Subir CSS (8 files) | 1 min |
| Subir imágenes DPF (8 files) | 2 min |
| Subir imágenes TPMS (4 files) | 10-15 min |
| Subir menú TPMS (1 file) | 2 min |
| Subir resto imágenes (60+ files) | 10 min |
| Subir sitemap/robots | 1 min |
| Build npm en VPS | 10-15 min |
| Verificaciones finales | 5 min |
| **TOTAL** | **~45-60 min** |

---

## ✅ VERIFICACIÓN DESPUÉS DE BUILD

### En terminal del VPS:

```bash
# 1. Verificar dist se generó
[ ] ls -la /home/visualmecanica/frontend/dist/
    → Debe mostrar: index.html, assets/, robots.txt, sitemap.xml

# 2. Verificar componentes compilados
[ ] grep -r "DPFPage" /home/visualmecanica/frontend/dist/assets/*.js
    → Debe encontrar referencias DPF

# 3. Verificar TPMS compilado
[ ] grep -r "TPMSPage" /home/visualmecanica/frontend/dist/assets/*.js
    → Debe encontrar referencias TPMS

# 4. Verificar video MP4
[ ] ls -lh /home/visualmecanica/frontend/dist/assets/ | grep mp4
    → Debe mostrar img_cuerpo-*.mp4

# 5. Verificar sitemap y robots en dist
[ ] ls -la /home/visualmecanica/frontend/dist/sitemap.xml
[ ] ls -la /home/visualmecanica/frontend/dist/robots.txt
    → Ambos deben existir

# 6. Contar archivos en dist/assets
[ ] ls -la /home/visualmecanica/frontend/dist/assets/ | wc -l
    → Debe mostrar 80+ archivos
```

### En navegador:

```
[ ] https://visualmecanica.cl/
    → Debe cargar página principal

[ ] https://visualmecanica.cl/dpf
    → Debe mostrar página DPF con imágenes

[ ] https://visualmecanica.cl/tpms
    → Debe mostrar página TPMS con video

[ ] https://visualmecanica.cl/sitemap.xml
    → Debe mostrar XML con 8 URLs

[ ] https://visualmecanica.cl/robots.txt
    → Debe mostrar contenido robots.txt
```

---

## 🔄 ROLLBACK EN CASO DE ERROR

### Si algo sale mal:

```bash
# 1. Restaurar dist anterior
cd /home/visualmecanica/frontend/
sudo systemctl stop nginx  # o detener al servidor

# 2. Opción A: Restaurar componentes
cd src/components/
rm *.jsx *.tsx
cp backup_21feb2026/* .

# 3. Opción B: Restaurar CSS
cd src/Csspersonalizado/
rm *.css
cp backup_css_21feb2026/* .

# 4. Hacer build limpio nuevamente
npm run build

# 5. Reiniciar servidor
sudo systemctl start nginx
```

---

## 📊 MONITOREO POST-DEPLOY

### Verificar que todo funciona:

```bash
# 1. Verificar servicio nginx
sudo systemctl status nginx

# 2. Ver logs de nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# 3. Verificar puertos abiertos
netstat -tuln | grep 80
netstat -tuln | grep 443

# 4. Probar conectividad
curl -I https://visualmecanica.cl/
# Debe retornar: HTTP/2 200

# 5. Probar rutas nuevas
curl -I https://visualmecanica.cl/dpf
curl -I https://visualmecanica.cl/tpms
# Ambas deben retornar: HTTP/2 200
```

---

## 🎯 PRÓXIMOS PASOS DESPUÉS DE DEPLOY

### 1. Indexación en Google (48-72 horas):
```
1. Ir a Google Search Console
2. Ingresar URL: https://visualmecanica.cl/sitemap.xml
3. Esperar procesamiento
4. Verificar: 8 URLs encontradas
```

### 2. Pruebas de funcionalidad:
- [ ] Página principal carga OK
- [ ] Menú DPF/TPMS visible
- [ ] Links funcionan
- [ ] Agendamiento funciona
- [ ] Pago accessible
- [ ] Video TPMS reproduce
- [ ] Imágenes DPF muestran

### 3. Optimizaciones de performance:
```bash
# Verificar cache headers
curl -I https://visualmecanica.cl/ | grep Cache

# Compresión gzip activa
curl -I -H "Accept-Encoding: gzip" https://visualmecanica.cl/ | grep Content-Encoding
```

---

## 📞 SOPORTE Y AYUDA

### Errores comunes y soluciones:

**Error: "Cannot find module"**
```bash
Solución: npm install
```

**Error: "Port 80 already in use"**
```bash
Solución: sudo systemctl stop nginx && sudo systemctl start nginx
```

**Error: "Permission denied"**
```bash
Solución: sudo chown -R visualmecanica:visualmecanica /home/visualmecanica/frontend/
```

**Error: "Build takes too long"**
```bash
Solución: npm run build -- --mode production (fuerza modo producción)
```

**Video TPMS no reproduce:**
```bash
Verificar: ls -lh /home/visualmecanica/frontend/dist/assets/img_cuerpo-*.mp4
Si no existe, re-subir desde: frontend/src/assets/img_tpms/img_cuerpo.mp4
```

---

## 💾 ARCHIVOS DE RESPALDO

Después del deploy exitoso, crear respaldos:

```bash
# En VPS:
cd /home/visualmecanica/frontend/

# Crear archivo de respaldo
tar -czf dist_respaldo_21feb2026_exito.tar.gz dist/
tar -czf componentes_respaldo_21feb2026.tar.gz src/components/

# Mover a destino seguro
mv *.tar.gz ../respaldos/

# Listar respaldos
ls -lh ../respaldos/
```

---

## 📋 CHECKLIST FINAL PRE-DEPLOYMENT

- [ ] Build completado exitosamente (dist/ generado)
- [ ] Sitemap.xml actualizado con 8 URLs
- [ ] robots.txt configurado correctamente
- [ ] Componentes DPF y TPMS incluidos
- [ ] Imágenes DPF (8 archivos) listos
- [ ] Imágenes TPMS (4 archivos) listos
- [ ] Video MP4 TPMS verificado (9.6 MB)
- [ ] CSS actualizados (8 archivos)
- [ ] Documentación preparada (4 archivos .md)
- [ ] Git commit realizado
- [ ] Respaldos creados

---

## 🎯 CHECKLIST FINAL POST-DEPLOYMENT

- [ ] Dist en VPS actualizado
- [ ] Nginx reiniciado
- [ ] Página principal carga correctamente
- [ ] Rutas /dpf y /tpms accesibles
- [ ] Imágenes se ven correctamente
- [ ] Video TPMS reproduce
- [ ] Sitemap.xml accesible en navegador
- [ ] robots.txt accesible en navegador
- [ ] Google Search Console actualizado
- [ ] No hay errores en logs (access.log, error.log)
- [ ] Performance adecuado (< 3 segundos)

---

**Generado:** 21 de febrero de 2026  
**Estado:** ✅ LISTO PARA EJECUTAR

### Contacto técnico:
Para soporte, revisar archivos de documentación incluidos en la raíz del proyecto.
