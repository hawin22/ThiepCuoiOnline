# ─── Stage 1: Build Frontend ───────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install deps first (layer cache)
COPY package*.json ./
RUN npm ci --prefer-offline

# Copy source & build
COPY . .
RUN npm run build

# ─── Stage 2: Production Server (Node.js + SQLite Backend + Static) ────
FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80

# Cài đặt công cụ cần thiết cho better-sqlite3 nếu cần build
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --omit=dev --prefer-offline

# Copy backend server & built frontend
COPY server/ ./server/
COPY --from=builder /app/dist ./dist

# Tạo thư mục lưu database
RUN mkdir -p /app/server/data

EXPOSE 80

CMD ["node", "server/index.js"]
