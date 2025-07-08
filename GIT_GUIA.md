# Guía paso a paso para configurar Git

## 1. Configurar Git inicial (ejecutar una sola vez)
```bash
cd c:\Users\Cesar-CRI-09\desarrollo_aplicaciones\pre-compra

# Configurar tu identidad (cambiar por tus datos)
git config --global user.name "Tu Nombre Completo"
git config --global user.email "tu.email@gmail.com"

# Verificar configuración
git config --list
```

## 2. Inicializar repositorio local
```bash
# Si no tienes repositorio Git
git init
git branch -M main

# Agregar todos los archivos
git add .

# Crear primer commit
git commit -m "Initial commit: Proyecto Visual Mecánica con Docker"
```

## 3. Conectar con GitHub

### Opción A: Repositorio nuevo
```bash
# Crear repositorio en GitHub primero, luego:
git remote add origin https://github.com/TU_USUARIO/visualmecanica-docker.git
git push -u origin main
```

### Opción B: Repositorio existente (actualizar)
```bash
# Si ya tienes un repositorio y quieres actualizarlo:
git remote set-url origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git

# Hacer backup del repositorio remoto (opcional)
git fetch origin
git checkout -b backup-xampp origin/main

# Volver a main y hacer push forzado
git checkout main
git push -u origin main --force
```

## 4. Comandos útiles para el día a día

### Guardar cambios
```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

### Ver estado
```bash
git status
git log --oneline
```

### Crear rama para desarrollo
```bash
git checkout -b desarrollo
git push -u origin desarrollo
```

### Sincronizar con el servidor
```bash
git pull origin main
```

## 5. Estructura recomendada de ramas

- `main`: Versión de producción
- `development`: Versión de desarrollo
- `feature/nombre-feature`: Nuevas características
- `hotfix/nombre-fix`: Correcciones urgentes

## 6. Flujo de trabajo recomendado

1. **Desarrollo local**: Trabaja en la rama `development`
2. **Nuevas características**: Crea ramas `feature/`
3. **Pruebas**: Merge a `development`
4. **Producción**: Merge a `main`
5. **Despliegue**: Desde `main` al servidor

## 7. Comandos de emergencia

### Deshacer último commit (sin perder cambios)
```bash
git reset --soft HEAD~1
```

### Deshacer cambios en un archivo
```bash
git checkout -- nombre_archivo.js
```

### Ver diferencias
```bash
git diff
git diff --staged
```
