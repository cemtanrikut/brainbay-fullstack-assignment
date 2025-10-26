# -------- Build stage: Node build
FROM node:20-alpine AS build

WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci

# Copy rest and build
COPY frontend/ ./
# Vite will read .env.production automatically at build time
RUN npm run build

# -------- Runtime stage: Nginx static server
FROM nginx:1.27-alpine AS runtime

# Nginx conf with /api proxy to backend
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
