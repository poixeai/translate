# 前端构建阶段
FROM node:24-alpine AS frontend-builder
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Go 后端构建阶段
FROM golang:1.24-alpine AS backend-builder
WORKDIR /app

RUN apk add --no-cache gcc musl-dev

COPY backend/ ./
RUN go mod download
RUN CGO_ENABLED=1 GOOS=linux go build -o translate-server .

# 运行阶段
FROM alpine:3.21 AS runner
WORKDIR /app

RUN apk add --no-cache nginx ca-certificates tzdata

COPY --from=frontend-builder /app/dist /usr/share/nginx/html
COPY --from=backend-builder /app/translate-server .
COPY nginx.conf /etc/nginx/http.d/default.conf

RUN mkdir -p /var/log/nginx /var/opt/translate

EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8081/health || exit 1

CMD ["sh", "-c", "./translate-server & nginx -g 'daemon off;'"]
