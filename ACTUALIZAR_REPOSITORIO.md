# Guía para actualizar repositorio existente

## Tu repositorio actual: https://github.com/cri-9/pre-compra.git

### Pasos para actualizar:

1. **Ejecutar el script de actualización:**
   ```bash
   # En Windows
   actualizar-repositorio.bat
   
   # En Linux/Mac
   ./actualizar-repositorio.sh
   ```

2. **O ejecutar manualmente:**
   ```bash
   # Conectar con tu repositorio
   git remote add origin https://github.com/cri-9/pre-compra.git
   
   # Hacer backup (opcional)
   git fetch origin main
   git checkout -b backup-xampp origin/main
   git checkout main
   
   # Agregar cambios
   git add .
   git commit -m "Actualización a Docker: Migración completa de XAMPP"
   
   # Actualizar repositorio
   git push -u origin main --force
   ```

### En el servidor de producción:

1. **Clonar el repositorio actualizado:**
   ```bash
   git clone https://github.com/cri-9/pre-compra.git visualmecanica
   cd visualmecanica
   ```

2. **Configurar para producción:**
   ```bash
   # Copiar variables de entorno
   cp .env.production .env
   
   # Editar con tus datos reales
   nano .env
   ```

3. **Desplegar:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

### Configurar dominio visualmecanica.cl:

1. **En tu hosting/VPS:**
   - Apuntar DNS A record a la IP del servidor
   - Configurar SSL con Let's Encrypt

2. **Actualizar configuración:**
   ```bash
   # Ejecutar script SSL
   chmod +x setup-ssl.sh
   ./setup-ssl.sh
   ```

### Verificar despliegue:

- **Frontend:** https://visualmecanica.cl
- **Backend API:** https://visualmecanica.cl/api
- **Panel admin:** https://visualmecanica.cl/Backend

### Comandos útiles:

```bash
# Ver estado de contenedores
docker-compose -f docker-compose.prod.yml ps

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Reiniciar servicios
docker-compose -f docker-compose.prod.yml restart

# Actualizar desde Git
git pull origin main
./deploy.sh
```

### Estructura final:

```
visualmecanica.cl/
├── Frontend (React + Vite)
├── Backend (PHP + Apache)
├── Database (MySQL)
└── Nginx (Reverse Proxy + SSL)
```

¡Tu repositorio https://github.com/cri-9/pre-compra.git estará listo para producción!
