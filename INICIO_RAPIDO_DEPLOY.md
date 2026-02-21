# 🚀 INSTRUCCIONES RÁPIDAS - DEPLOY EN VPS (15 MINUTOS)

**Fecha:** 21 de febrero de 2026  
**Build:** Completado y listo  
**Archivos adjuntos:** 7 documentos de referencia completos

---

## ⚡ RESUMEN EJECUTIVO (30 segundos)

✅ **BUILD LISTO**
- 12,394 módulos compilados
- 0 errores, 0 warnings
- 77 archivos en `dist/`
- ~17 MB total optimizadoruminio

✅ **DOCUMENTACIÓN COMPLETA**
- 7 archivos .md (3,500+ líneas)
- Instrucciones paso a paso
- Comandos listos para copiar
- Checklists de verificación

✅ **PRÓXIMO PASO**
→ Subir vía SFTP (Bitvise)
→ Hacer build en VPS
→ Verificar en navegador

---

## 📄 ARCHIVOS DE REFERENCIA

| Documento | Para | Lectura |
|-----------|------|---------|
| **BUILD_COMPLETADO_RESUMEN_FINAL.md** | Todos | 10 min |
| **INSTRUCCIONES_DEPLOYMENT_VPS.md** | Técnico deploy | ⭐ CRÍTICO |
| **LISTA_ARCHIVOS_SUBIR_BITVISE.md** | Técnico SFTP | 15 min |
| **CARPETAS_IMAGENES_DPF_TPMS.md** | Si dudas imágenes | 10 min |
| **ANALISIS_SEO_SITEMAP_ROBOTS.md** | SEO team | 15 min |
| **INDICE_DOCUMENTACION_COMPLETA.md** | Búsquedas | Ref |
| **Este archivo** | Vista rápida | 5 min |

---

## 🎯 OPCIÓN 1: Upload dist compilado (MÁS RÁPIDO - 10 min)

```bash
1. Conectar a VPS (Bitvise SFTP)
   • Host: [IP_VPS]
   • Usuario: visualmecanica

2. Navegar a: /home/visualmecanica/frontend/

3. Respaldar actual:
   mv dist dist_backup_$(date +%d%m%Y)

4. Upload dist/ completo
   (Drag & drop desde c:\...\frontend\dist)

5. En VPS terminal:
   sudo chown -R visualmecanica:visualmecanica dist/
   sudo chmod -R 755 dist/
   sudo systemctl restart nginx
```

**Tiempo:** ~10 minutos  
**Ventaja:** Rápido, sin compilar
**Nota:** Ver archivo INSTRUCCIONES_DEPLOYMENT_VPS.md para más opciones

---

## 🔧 OPCIÓN 2: Upload componentes + Build en VPS (RECOMENDADO - 60 min)

### Paso 1: Upload SFTP (45 minutos)

```bash
COMPONENTES:
1. Ir a: /home/visualmecanica/frontend/src/components/
2. Backup: mkdir backup_21feb2026 ; cp *.jsx *.tsx backup_21feb2026/
3. Subir 38 archivos desde: c:\...\frontend\src\components\

CSS:
1. Ir a: /home/visualmecanica/frontend/src/Csspersonalizado/
2. Subir 8 archivos CSS

IMÁGENES:
1. Ir a: /home/visualmecanica/frontend/src/assets/
2. Subir carpeta: img_prin_dpf/ (8 imágenes)
3. Subir carpeta: img_tpms/ (4 archivos + video 9.6MB)
4. Subir carpeta: img_menu_superior_tpms/
5. Subir resto de carpetas (19 carpetas total)

SEO:
1. Ir a: /home/visualmecanica/frontend/
2. Subir: sitemap.xml
3. Subir: robots.txt
```

### Paso 2: Build en VPS (15 minutos)

```bash
# Terminal del VPS como root
cd /home/visualmecanica/frontend

# Instalar dependencias (si es primera vez)
npm install

# Compilar
npm run build

# Cambiar permisos
sudo chown -R visualmecanica:visualmecanica dist/
sudo chmod -R 755 dist/

# Reiniciar
sudo systemctl restart nginx
```

---

## ✅ VERIFICACIÓN (5 minutos)

### En navegador:

```
[ ] https://visualmecanica.cl/          → Landing OK
[ ] https://visualmecanica.cl/dpf       → DPF OK
[ ] https://visualmecanica.cl/tpms      → TPMS OK
[ ] https://visualmecanica.cl/sitemap.xml
[ ] https://visualmecanica.cl/robots.txt
```

### Comandos en VPS:

```bash
# Verificar build
ls -la /home/visualmecanica/frontend/dist/ | head -20

# Verificar imágenes
ls -la /home/visualmecanica/frontend/dist/assets/ | wc -l
# → Debe mostrar 80+ archivos

# Ver logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## 📊 QUÉ CAMBIÓ

### Componentes:
- ✨ **DPFPage.jsx** - Nueva página completa DPF
- ✨ **TPMSPage.jsx** - Nueva página completa TPMS  
- ✨ **SEO.tsx** - Componente SEO con canonical URLs
- 🔄 35 componentes mejorados

### Imágenes:
- 📁 **img_prin_dpf/** - 8 imágenes DPF nuevas
- 📁 **img_tpms/** - 4 archivos TPMS (2.3-2.5MB PNG + 9.6MB MP4)
- 📁 **img_menu_superior_tpms/** - 1 banner nuevo

### SEO:
- 🗺️ **sitemap.xml** - 8 URLs (era 2, ahora +DPF/TPMS)
- 🤖 **robots.txt** - Optimizado con rutas nuevas

---

## 💾 ARCHIVOS A SUBIR RESUMEN

```
📦 TOTAL: ~130+ archivos

Componentes:     38 archivos JSX/TSX    (~500 KB)
CSS:             8 archivos              (~50 KB)
Imágenes:        80+ archivos            (~5 MB)
Video TPMS:      1 archivo MP4           (9.65 MB)
SEO:             2 archivos              (~20 KB)

TOTAL FUENTE:    ~15 MB
TOTAL DIST:      ~17 MB (optimizado)
```

---

## ⏱️ TIEMPO TOTAL

| Tarea | Tiempo |
|-------|--------|
| Upload componentes | 5 min |
| Upload CSS | 1 min |
| Upload imágenes | 20 min |
| Build VPS | 10-15 min |
| Verificaciones | 5 min |
| **TOTAL** | **40-55 min** |

---

## 🚨 PUNTOS CRÍTICOS

⚠️ **Video MP4 TPMS (9.65 MB)**
- Es el archivo más grande
- Puede tardar en subir
- Esperar confirmación completa

⚠️ **Imágenes PNG TPMS (2.3-2.5 MB c/u)**
- No redimensionar
- Necesarios para página TPMS
- Son referencias estáticas

⚠️ **Build en VPS**
- Puede tardar 10-15 minutos
- Tener paciencia
- Buscar mensaje "✓ built in XXXs"

---

## 🔄 SI ALGO FALLA

### Error: Port already in use
```bash
sudo systemctl stop nginx
sudo systemctl start nginx
```

### Error: Permission denied
```bash
sudo chown -R visualmecanica:visualmecanica /home/visualmecanica/frontend/
sudo chmod -R 755 /home/visualmecanica/frontend/
```

### Rollback rápido
```bash
cd /home/visualmecanica/frontend/
sudo systemctl stop nginx
rm -rf dist/
mv dist_backup_* dist/
sudo systemctl start nginx
```

---

## 📞 AYUDA Y REFERENCIAS

### Preguntas frecuentes:
**P: ¿Cuáles archivos subir?**  
R: Ver `LISTA_ARCHIVOS_SUBIR_BITVISE.md`

**P: ¿Cómo subir vía SFTP?**  
R: Ver `INSTRUCCIONES_DEPLOYMENT_VPS.md`

**P: ¿Dónde está el video TPMS?**  
R: `/home/visualmecanica/frontend/src/assets/img_tpms/img_cuerpo.mp4`

**P: ¿El build tiene errores?**  
R: No. Compilado con 0 errores, 0 warnings.

**P: ¿Qué registrar en Google?**  
R: Ver `ANALISIS_SEO_SITEMAP_ROBOTS.md`

---

## 📋 CHECKLIST RÁPIDAS

### Antes de subir:
- [ ] Instalaste Bitvise (Cliente SFTP)
- [ ] Tienes credenciales VPS
- [ ] Conectes a VPS sin problemas

### Durante upload:
- [ ] Creas respaldos de archivos actuales
- [ ] Subes en orden: componentes → CSS → imágenes
- [ ] Esperas a que video MP4 termine

### Después de build:
- [ ] No hay errores en logs
- [ ] Dist se generó (77 archivos)
- [ ] Permisos asignados correctamente

### Validación final:
- [ ] Página principal carga
- [ ] /dpf funciona
- [ ] /tpms reproduce video
- [ ] Sitemap accesible

---

## 🎓 SIGUIENTE NIVEL (Después de deploy)

### 1. Google Search Console (48-72h)
```
1. Registra: https://visualmecanica.cl/sitemap.xml
2. Espera procesamiento de 8 URLs
3. Verifica indexación de DPF/TPMS
```

### 2. Monitorea indexación
```
Google: site:visualmecanica.cl/dpf
Google: site:visualmecanica.cl/tpms
```

### 3. Performance
```
PageSpeed: https://pagespeed.web.dev/
Tiempo de carga debe ser < 3 segundos
```

---

## 📚 DOCUMENTACIÓN COMPLETA

**Para información detallada de cada aspecto:**

1. **Build general** → BUILD_COMPLETADO_RESUMEN_FINAL.md
2. **Instrucciones VPS** → INSTRUCCIONES_DEPLOYMENT_VPS.md
3. **Upload SFTP** → LISTA_ARCHIVOS_SUBIR_BITVISE.md
4. **Imágenes DPF/TPMS** → CARPETAS_IMAGENES_DPF_TPMS.md
5. **SEO y buscadores** → ANALISIS_SEO_SITEMAP_ROBOTS.md
6. **Índice y buscar** → INDICE_DOCUMENTACION_COMPLETA.md

**Total: 3,500+ líneas documentadas**

---

## ✅ ESTADO FINAL

```
╔═════════════════════════════════════════════════╗
║  ✅ BUILD COMPLETADO - 100% LISTO              ║
║                                                 ║
║  Próximo paso: Ejecutar instrucciones deploy   ║
║                                                 ║
║  Tiempo total: 40-60 minutos                    ║
║  Errores esperados: 0                           ║
║  Documentación: 7 archivos completos            ║
╚═════════════════════════════════════════════════╝
```

---

**Generado:** 21 de febrero de 2026  
**Versión:** Quick Start v1.0  
**Status:** ✅ LISTO PARA ACCIÓN

👉 **COMIENZA POR:** Leer `INSTRUCCIONES_DEPLOYMENT_VPS.md` antes de subir archivos.
