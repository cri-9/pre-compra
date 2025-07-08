# Imagen base oficial de Node (usando imagen normal en lugar de Alpine)
FROM node:20

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia solo los archivos de dependencias para instalar primero (mejor cache)
COPY package*.json ./

# Limpiar caché de npm y instalar dependencias
RUN npm cache clean --force
RUN rm -rf node_modules package-lock.json
RUN npm install

# Copia el resto del proyecto
COPY . .

# Expone el puerto que usa Vite
EXPOSE 3001

# Comando para iniciar el frontend (modo desarrollo)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

