# Build stage — context must be repo root (demo references ../src)
FROM node:22-alpine AS builder

WORKDIR /app

# Copy root package files and install library dependencies
COPY package*.json .npmrc ./
RUN --mount=type=secret,id=github_token \
    GHCR_TOKEN=$(cat /run/secrets/github_token) \
    npm ci --ignore-scripts

# Remove .npmrc so token does not leak into subsequent layers
RUN rm -f .npmrc

# Copy library source and config (needed by demo aliases and tsc)
COPY src/ src/
COPY config/ config/
COPY tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY vite.config.ts ./

# Copy demo app
COPY demo/ demo/

# Install demo dependencies (file:.. resolves to the local library)
WORKDIR /app/demo
RUN npm ci --ignore-scripts

# Build the demo (tsc + vite build -> dist/)
RUN npm run build

# -----------------------------------------------------------
# Production stage — serve static SPA with nginx
# -----------------------------------------------------------
FROM nginx:alpine AS runner

RUN apk add --no-cache curl

# Create non-root user and fix permissions
RUN chown -R nginx:nginx /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid

# Copy custom nginx config for SPA routing
COPY demo/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files
COPY --from=builder /app/demo/dist /usr/share/nginx/html

USER nginx

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
