# Imagen base oficial de Node (usando imagen normal en lugar de Alpine)
FROM node:20

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia solo los archivos de dependencias para instalar primero (mejor cache)
COPY package*.json ./


# Limpiar caché de npm y asegurar instalación de TODAS las dependencias (incluyendo devDependencies)
RUN npm cache clean --force
RUN rm -rf node_modules package-lock.json
# IMPORTANTE: No usar --production ni establecer NODE_ENV=production aquí, para que se instalen devDependencies (como typescript)
RUN npm install

# Copia el resto del proyecto
COPY . .

# Para desarrollo: hacer build para probar archivos estáticos
RUN npm run build

# Copiar archivos de public al dist (esto simula lo que haría en producción)
RUN cp -r public/* dist/ 2>/dev/null || echo "Algunos archivos de public ya están en dist"

# Expone el puerto que usa Vite
EXPOSE 3001

# Comando para iniciar el frontend (modo desarrollo con preview del build)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

