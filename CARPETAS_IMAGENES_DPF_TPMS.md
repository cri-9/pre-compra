# CARPETAS DE IMÁGENES - DPF Y TPMS
**Fecha:** 21 de febrero de 2026  
**Build:** Actualizado y compilado

---

## 📁 CARPETA: img_prin_dpf (DPF - Filtro de Partículas Diesel)

**Ubicación en VPS:** `/home/visualmecanica/frontend/src/assets/img_prin_dpf/`  
**Ubicación en Dist:** `/home/visualmecanica/frontend/dist/assets/`

### Imágenes incluidas (8 archivos):

| # | Archivo Original | Archivo Compilado (Dist) | Tamaño | Descripción |
|---|---|---|---|---|
| 1 | `img_dpf_pro_1.png` | `img_dpf_pro_1-CXV2yBo_.png` | 294.38 kB | Imagen principal 1 DPF |
| 2 | `img_dpf_pro_2.jpg` | `img_dpf_pro_2-DHB05YHh.jpg` | 23.57 kB | Imagen 2 DPF |
| 3 | `img_dpf_pro_3.jpg` | `img_dpf_pro_3-DplR1smk.jpg` | 89.33 kB | Imagen hero DPF |
| 4 | `img_dpf_pro_4.jpg` | `img_dpf_pro_4-wu6ahkNk.jpg` | 111.97 kB | Banner menú DPF |
| 5 | `img_dpf_pro_5.jpg` | `img_dpf_pro_5-9lcbHOKk.jpg` | 12.26 kB | Imagen 5 DPF |
| 6 | `img_dpf_pro_6.png` | `img_dpf_pro_6-CGw7sZWs.png` | 430.59 kB | Imagen 6 DPF (Grande) |
| 7 | `img_dpf_pro_7.jpg` | `img_dpf_pro_7-CCXs717N.jpg` | 55.95 kB | Imagen 7 DPF |
| 8 | `img_dpf_pro_8.jpg` | `img_dpf_pro_8-Cowg50s-.jpg` | 62.11 kB | Imagen 8 DPF |

**Total en carpeta fuente:** 8 imágenes  
**Tamaño total:** ~1.08 MB  
**Formato:** JPG y PNG

#### Uso en componente DPFPage.jsx:
- **Importación tipo:** Módulos estáticos
- **Ubicación en código:**
  ```jsx
  import dpfImage1 from "../assets/img_prin_dpf/img_dpf_pro_1.png";
  import dpfImage2 from "../assets/img_prin_dpf/img_dpf_pro_2.jpg";
  import heroImage from "../assets/img_prin_dpf/img_dpf_pro_3.jpg";
  import bannerMenuImage from "../assets/img_prin_dpf/img_dpf_pro_4.jpg";
  import dpfImage5 from "../assets/img_prin_dpf/img_dpf_pro_5.jpg";
  import dpfImage6 from "../assets/img_prin_dpf/img_dpf_pro_6.png";
  import dpfImage7 from "../assets/img_prin_dpf/img_dpf_pro_7.jpg";
  import dpfImage8 from "../assets/img_prin_dpf/img_dpf_pro_8.jpg";
  ```

---

## 📁 CARPETA: img_tpms (TPMS - Sistema de Presión de Llantas)

**Ubicación en VPS:** `/home/visualmecanica/frontend/src/assets/img_tpms/`  
**Ubicación en Dist:** `/home/visualmecanica/frontend/dist/assets/`

### Archivos incluidos (4 archivos: 3 imágenes + 1 video):

| # | Archivo Original | Archivo Compilado (Dist) | Tamaño | Descripción |
|---|---|---|---|---|
| 1 | `img_cuerpo.mp4` | `img_cuerpo-Da5U5ifd.mp4` | **9,652.95 kB** | 🎬 Video principal TPMS |
| 2 | `img_tpms_que_es.png` | `img_tpms_que_es-BU9dacoQ.png` | **2,311.88 kB** | Imagen TPMS qué es |
| 3 | `img_tpms_que_es_3.png` | `img_tpms_que_es_3-dgjAtZ9m.png` | **2,497.58 kB** | Imagen TPMS alternativa |
| 4 | `tpms_presion_llanta.png` | `tpms_presion_llanta-CQ4MwU57.png` | 71.29 kB | Icono presión llanta |

**Total en carpeta fuente:** 4 archivos  
**Tamaño total:** ~14.53 MB  
**Formatos:** PNG (3 imágenes) + MP4 (1 video)

#### Uso en componente TPMSPage.jsx:
- **Importación tipo:** Módulos estáticos + Video
- **Ubicación en código:**
  ```jsx
  import bannerMenuImage from "../assets/img_menu_superior_tpms/img_banner_menu.webp";
  import videoTPMS from "../assets/img_tpms/img_cuerpo.mp4";
  import sensorImage from "../assets/img_tpms/img_tpms_que_es.png";
  import sensorImage1 from "../assets/img_tpms/img_tpms_que_es_3.png";
  import tpmsIcono from "../assets/img_tpms/tpms_presion_llanta.png";
  ```

#### Características del video MP4:
- **Nombre:** img_cuerpo.mp4
- **Tamaño:** 9.65 MB (puede tardar en descarga/upload)
- **Formato:** MP4 (compatible con navegadores modernos)
- **Uso:** Reproductor automático en fondo de sección TPMS

⚠️ **IMPORTANTE:** Este es el archivo más grande. Verificar que se descargue completamente durante el upload.

---

## 📁 CARPETA: img_menu_superior_tpms (Menú Superior TPMS)

**Ubicación en VPS:** `/home/visualmecanica/frontend/src/assets/img_menu_superior_tpms/`  
**Ubicación en Dist:** `/home/visualmecanica/frontend/dist/assets/`

### Archivos incluidos (1 archivo):

| # | Archivo Original | Archivo Compilado (Dist) | Tamaño | Descripción |
|---|---|---|---|---|
| 1 | `img_banner_menu.webp` | `img_banner_menu-D0tuSsC8.webp` | 799.42 kB | Banner menú TPMS |

**Total en carpeta:** 1 imagen  
**Tamaño:** 799 kB  
**Formato:** WebP (optimizado)

#### Uso en TPMSPage.jsx:
```jsx
import bannerMenuImage from "../assets/img_menu_superior_tpms/img_banner_menu.webp";
```

---

## 🎨 RELACIÓN CON OTRAS CARPETAS DE IMÁGENES

### Carpetas utilizadas junto con DPF/TPMS:

#### 1. **Logo_Superior/**
- Ubicación: `/home/visualmecanica/frontend/src/assets/Logo_Superior/`
- Archivos: logo_superior_menu2.webp
- Uso: Navbar y menús principales
- Tamaño: 34.64 kB

#### 2. **About/**
- Ubicación: `/home/visualmecanica/frontend/src/assets/About/`
- Archivos: about_1.webp, about_2.webp
- Uso: Sección About (página principal)
- Tamaño: 132.25 kB + 308.85 kB

#### 3. **Testimonios/**
- Ubicación: `/home/visualmecanica/frontend/src/assets/Testimonios/`
- Archivos: persona1.webp, persona2.webp
- Uso: Sección de testimonios
- Tamaño: 100.48 kB + 60.74 kB

#### 4. **Portadas_trabajos/**
- Ubicación: `/home/visualmecanica/frontend/src/assets/Portadas_trabajos/`
- Archivos: portada_01 a 04
- Uso: Portadas de trabajos realizados
- Tamaño: 149.87 kB + 153.94 kB + 85.05 kB + 57.64 kB

#### 5. **Valores_Servicios/**
- Ubicación: `/home/visualmecanica/frontend/src/assets/Valores_Servicios/`
- Archivos: mecanica_valor1, mecanica_valor2, dpf_valor4, etc.
- Tamaño: Varias imágenes WebP

---

## 📊 ESTADÍSTICAS TOTALES DE IMÁGENES

### Por página:
| Página | Carpetas de imagen | Total archivos | Tamaño aprox |
|--------|---|---|---|
| DPFPage | img_prin_dpf | 8 | 1.08 MB |
| TPMSPage | img_tpms, img_menu_superior_tpms | 5 | 14.53 MB |
| Landing Page | About, Testimonios, Portadas_trabajos, Valores_Servicios, Logo_Superior | 15+ | 2-3 MB |
| General | Logo_Footer, Logo_Formulario, Nuestras_Herramientas, etc. | 20+ | 1-2 MB |

### Por formato:
| Formato | Cantidad | Tamaño total | Ventajas |
|---------|----------|---|---|
| **WebP** | 40+ | 4-5 MB | Menor tamaño, mejor compresión |
| **PNG** | 15+ | 5-6 MB | Sin pérdida, transparencia |
| **JPG** | 20+ | 2-3 MB | Comprimido, buena calidad |
| **MP4** | 1 | 9.65 MB | Video optimizado |
| **GIF** | 2-3 | 10-20 kB | Animaciones pequeñas |
| **SVG** | 5+ | 50-200 kB | Escalables |

**Total de imágenes en proyecto:** 80+ archivos  
**Tamaño total compilado:** ~17 MB (en dist)

---

## 🔄 SINCRONIZACIÓN DE CARPETAS

### Orden de sincronización recomendado:

1. **Prioritarias (Build esencial):**
   - img_prin_dpf/ ✅
   - img_tpms/ ✅
   - img_menu_superior_tpms/ ✅

2. **Secundarias (Layout general):**
   - Logo_Superior/ ✅
   - About/ ✅
   - Testimonios/ ✅
   - Portadas_trabajos/ ✅

3. **Terciarias (Componentes secundarios):**
   - Valores_Servicios/
   - Logo_Formulario/
   - Logo_Footer/
   - Resto de carpetas

---

## ✅ CHECKLIST DE VERIFICACIÓN

### Después de upload en VPS:

```bash
# 1. Verificar DPF
[ ] ls -la /home/visualmecanica/frontend/src/assets/img_prin_dpf/ | wc -l
    → Debe mostrar 8 métodos

# 2. Verificar TPMS
[ ] ls -la /home/visualmecanica/frontend/src/assets/img_tpms/ | wc -l
    → Debe mostrar 4 archivos

# 3. Verificar video MP4
[ ] ls -lh /home/visualmecanica/frontend/src/assets/img_tpms/img_cuerpo.mp4
    → Debe mostrar 9.6 MB aproximadamente

# 4. Verificar imágenes grandes PNG
[ ] ls -lh /home/visualmecanica/frontend/src/assets/img_tpms/img_tpms_que_es*.png
    → Debe mostrar dos archivos de ~2.3 MB y ~2.5 MB

# 5. Verificar menú superior
[ ] ls -la /home/visualmecanica/frontend/src/assets/img_menu_superior_tpms/
    → Debe mostrar banner_menu.webp (799 kB)

# 6. Verificar permisos
[ ] chmod 755 /home/visualmecanica/frontend/src/assets/img_prin_dpf/*
[ ] chmod 755 /home/visualmecanica/frontend/src/assets/img_tpms/*

# 7. Build final
[ ] cd /home/visualmecanica/frontend && npm run build
    → Debe compilar sin errores
```

---

## 📝 NOTAS IMPORTANTES

🔴 **CRÍTICO:**
- El video `img_cuerpo.mp4` es de 9.65 MB - puede tardar en subir. Esperar confirmación de upload completo.
- Las imágenes PNG de TPMS son grandes (2.3-2.5 MB c/u) - no redimensionar.

🟡 **IMPORTANTE:**
- Todas las imágenes están optimizadas en el build (hash busting)
- Los nombres en dist son diferentes (tienen hash) para cacheo eficiente
- No editar nombres de archivos sin actualizar componentes

🟢 **INFORMACIÓN:**
- Todas las imágenes WebP son versiones optimizadas de JPG
- Las PNG se usan cuando se requiere transparencia
- El MP4 es reproducido automáticamente en secciones con fondo video

---

**Generado:** 21 de febrero de 2026  
**Status:** ✅ LISTO PARA DEPLOY
