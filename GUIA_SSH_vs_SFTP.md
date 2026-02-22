# 🎯 GUÍA RÁPIDA: SSH vs SFTP - ¿DÓNDE EJECUTO QUÉ?

**Fecha:** 21 de febrero de 2026  
**Propósito:** Aclarar diferencias entre SSH (terminal) y SFTP (gestor archivos)

---

## 🔴 IMPORTANTE: DOS HERRAMIENTAS DIFERENTES

### 🔵 **SFTP (Bitvise Client)** = Gestor gráfico de archivos
- Es como el "Explorador de Windows" pero del VPS
- Drag & drop para subir/descargar archivos
- **NO ejecuta comandos**
- Es visual y gráfico

### ⚫ **SSH (PuTTY/Terminal)** = Línea de comandos
- Es como la terminal de Windows PowerShell
- Ejecuta comandos bash/shell
- Necesita texto
- Es donde escribes `mkdir`, `cp`, `ls`, etc.

---

## 📋 TABLA DE REFERENCIA

| Tarea | Herramienta | Cómo |
|-------|-------------|------|
| **Crear carpeta (mkdir)** | ⚫ SSH | Terminal |
| **Copiar archivos (cp)** | ⚫ SSH | Terminal |
| **Navegar carpetas (cd)** | ⚫ SSH | Terminal |
| **Ver archivos (ls)** | ⚫ SSH | Terminal |
| **Subir archivos** | 🔵 SFTP | Drag & drop |
| **Descargar archivos** | 🔵 SFTP | Drag & drop |
| **Eliminar archivos** | 🔵 SFTP | Click derecho > Delete |
| **Compilar (npm run build)** | ⚫ SSH | Terminal |
| **Reiniciar nginx** | ⚫ SSH | Terminal |

---

## 🚀 PASO A PASO DEL DEPLOYMENT

### PASO 1: Hacer respaldos

**1️⃣ ABRE TERMINAL SSH (PuTTY)**
```bash
ssh root@[IP_VPS]
# Ingresa contraseña

# Luego copia y pega esto:
cd /home/visualmecanica/frontend/src/components
mkdir backup_21feb2026
cp *.jsx backup_21feb2026/
cp *.tsx backup_21feb2026/

# ✅ LISTO
```

**2️⃣ CIERRA TERMINAL y ABRE BITVISE SFTP**

---

### PASO 2: Subir componentes

**EN BITVISE SFTP (Gestor gráfico):**

```
1. Navega en SFTP a: /home/visualmecanica/frontend/src/components/

2. ELIMINA archivos viejos:
   - Selecciona todos los *.jsx
   - Click derecho → Delete
   - Selecciona todos los *.tsx
   - Click derecho → Delete

3. SUBE archivos nuevos:
   - Abre explorador local: c:\...\frontend\src\components\
   - Selecciona los 38 archivos
   - Drag & drop a Bitvise
   - Or copy/paste entre ventanas

4. ESPERA a que termine (muestra progreso)
```

---

### PASO 3: Subir CSS

**EN BITVISE SFTP:**

```
1. Navega a: /home/visualmecanica/frontend/src/Csspersonalizado/

2. Elimina *.css viejos (Click derecho > Delete)

3. Sube 8 archivos CSS nuevos (Drag & drop)

4. Espera a terminar
```

---

### PASO 4: Subir imágenes

**EN BITVISE SFTP:**

```
1. Navega a: /home/visualmecanica/frontend/src/assets/

2. Copia carpetas de imágenes desde local:
   - img_prin_dpf/
   - img_tpms/
   - img_menu_superior_tpms/
   - resto de carpetas
   
3. Drag & drop cada carpeta

4. ESPERA especialmente en:
   - img_tpms/img_cuerpo.mp4 (9.6 MB) ⏳
   - Imágenes PNG TPMS (2.3-2.5 MB c/u)
```

---

### PASO 5: Hacer build

**ABRE TERMINAL SSH NUEVAMENTE (PuTTY):**

```bash
ssh root@[IP_VPS]
# Ingresa contraseña

# Copia y pega esto:
cd /home/visualmecanica/frontend
npm run build

# Espera ~10-15 minutos hasta que veas:
# "✓ built in XX.XXs"

# Cuando termine:
sudo chown -R visualmecanica:visualmecanica dist/
sudo chmod -R 755 dist/
sudo systemctl restart nginx
```

---

## 📊 RESUMEN VISUAL

```
PASO 1: SSH Terminal
      ↓ mkdir, cp (crear respaldos)
      
PASO 2: SFTP Gestor gráfico
      ↓ Drag & drop componentes
      
PASO 3: SFTP Gestor gráfico
      ↓ Drag & drop CSS
      
PASO 4: SFTP Gestor gráfico
      ↓ Drag & drop imágenes
      
PASO 5: SSH Terminal
      ↓ npm run build, chmod, nginx
      
✅ LISTO
```

---

## 🎯 TUTORIAL VISUAL

### Abriendo SSH (Terminal):

```
1. Descarga PuTTY: https://www.putty.org/
2. Abre putty.exe
3. Host: [Tu IP del VPS]
4. Port: 22
5. Connection type: SSH
6. Click "Open"
7. Usuario: root
8. Contraseña: [Tu contraseña]
9. ¡Listo! Ya estás en terminal SSH
```

### Abriendo SFTP (Bitvise):

```
1. Descarga Bitvise SSH Client: https://www.bitvise.com
2. Abre Bitvise
3. Host: [Tu IP del VPS]
4. Username: visualmecanica
5. Password: [Tu contraseña]
6. Click "Connect"
7. Click "SFTP" tab (arriba)
8. Ya ves carpetas del VPS como Windows Explorer
```

---

## ⚠️ ERRORES COMUNES

### ❌ ERROR: "No encuentro el comando"
**Causa:** Lo escribiste en SFTP en lugar de SSH  
**Solución:** Abre una terminal SSH (PuTTY)

### ❌ ERROR: "No veo las carpetas"
**Causa:** Estás en SSH cuando deberías estar en SFTP  
**Solución:** Abre Bitvise SFTP, no terminal

### ❌ ERROR: Subo un archivo pero no aparece
**Causa:** SFTP no actualizó la vista  
**Solución:** Click derecho → Refresh (o F5)

### ❌ ERROR: "Permission denied"
**Causa:** Permisos incorrectos  
**Solución:** Ejecuta en SSH: `sudo chmod -R 755 /ruta/`

---

## 📝 COMANDOS BÁSICOS PARA SSH

Si necesitas otros comandos en terminal SSH:

```bash
# Ver archivos
ls -la /directorio/

# Crear carpeta
mkdir nombre_carpeta

# Copiar archivo
cp archivo destino/

# Navegar
cd /directorio/

# Ver contenido de archivo
cat archivo.txt

# Buscar
grep "palabra" archivo.txt

# Contar líneas
wc -l archivo.txt

# Salir
exit
```

---

## 🔄 FLUJO COMPLETO EN 5 PASOS

```
1. ⚫ SSH: mkdir backup_21feb2026
              cp *.jsx backup_21feb2026/
              cp *.tsx backup_21feb2026/
   
2. 🔵 SFTP: Elimina *.jsx y *.tsx viejos
            
3. 🔵 SFTP: Drag & drop 38 nuevos componentes
   
4. 🔵 SFTP: Drag & drop imágenes, CSS
   
5. ⚫ SSH: npm run build
            chmod -R 755 dist/
            systemctl restart nginx
```

---

## 🎓 RESUMEN FINAL

| Aspecto | SSH (Terminal) | SFTP (Gestor) |
|---------|---|---|
| Apariencia | Texto negro, línea de comandos | Windows Explorer tipo |
| Función | Ejecutar comandos | Mover archivos visualmente |
| Uso en deploy | Respaldos, build, permisos | Subir componentes, imágenes, CSS |
| Velocidad | Rápido | Depende velocidad internet |
| Para principiantes | Más fácil copiar/pegar | Más visual e intuitivo |

**CONSEJO:** Mantén ambas abiertas durante el deployment:
- SSH en una ventana / terminal
- SFTP en otra ventana lado a lado

---

**Generado:** 21 de febrero de 2026  
**Claridad:** ✅ 100%  
**Confusión eliminada:** ✅ Sí
