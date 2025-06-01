# ──────────────────────────────────────────────────────────────
# Etapa 1  ▸  Build de la app con Vite
# ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Copiamos package.json + lock para cachear dependencias
COPY package*.json ./

# Instalamos dependencias (–legacy-peer-deps si lo necesitas)
RUN npm ci --legacy-peer-deps

# Copiamos el resto del código fuente
COPY . .

# Aseguramos que el archivo de variables de prod existe
# (ajusta el nombre si usas .env o .env.production.local)
COPY .env.production .env.production

# Compilamos el bundle de producción
RUN npm run build
# El resultado queda en /app/dist

# ──────────────────────────────────────────────────────────────
# Etapa 2  ▸  Contenedor liviano para servir estáticos
# ──────────────────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

# Copiamos el bundle desde la etapa anterior
COPY --from=build /app/dist ./dist

# Instalamos 'serve' para servir contenido estático
RUN npm install -g serve

# Puerto en el que escucharemos (matchea con docker-compose 3000:3000)
EXPOSE 3000

# Comando de arranque
CMD ["serve", "-s", "dist", "-l", "3000"]
