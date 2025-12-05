# ---------------------------
# Step 1 — Build Vite/React App
# ---------------------------
FROM node:20 AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (clean & reliable)
RUN npm ci

# Copy rest of the project
COPY . .

# Build Vite project
RUN npm run build

# ---------------------------
# Step 2 — Serve with NGINX
# ---------------------------
FROM nginx:alpine

# Copy build output to NGINX
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom NGINX config template
COPY default.conf.template /etc/nginx/conf.d/default.conf.template

# Cloud Run port (nginx will use this)
ENV PORT 8080

EXPOSE 8080

# Replace port dynamically & run nginx
CMD ["/bin/sh", "-c", "envsubst '$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
