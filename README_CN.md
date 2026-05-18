<div align="center">
  <h1>Poixe Translate (Rory 特别版)</h1>
  <p>支持多端同步与智能互译的轻量化 AI 翻译工具</p>

[English](./README.md) / 简体中文

  <p>
    <a href="https://github.com/its-rory/translate/blob/main/LICENSE">
      <img alt="License" src="https://img.shields.io/github/license/its-rory/translate?style=for-the-badge&color=blue">
    </a>
    <a href="https://github.com/its-rory/translate">
      <img alt="Vite" src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white">
    </a>
    <a href="https://github.com/its-rory/translate/stargazers">
      <img alt="Stars" src="https://img.shields.io/github/stars/its-rory/translate?style=for-the-badge&logo=github">
    </a>
    <a href="https://github.com/its-rory/translate/issues">
      <img alt="Issues" src="https://img.shields.io/github/issues/its-rory/translate?style=for-the-badge&logo=github">
    </a>
  </p>

  <h4>
    <a href="#quick-start">快速开始</a>
    <span> · </span>
    <a href="#deploy">部署教程</a>
    <span> · </span>
    <a href="#model">支持模型</a>
    <span> · </span>
    <a href="#language">翻译语言</a>
  </h4>
  
  <img src="./docs/assets/poster.png" alt="poster">
</div>

---

**Poixe Translate (Rory 特别版)** 是原版开源工具的增强版本。它不仅包含原有的所有核心功能，还针对私人部署场景进行了深度优化，特别增强了多端配置同步和智能互译体验。

## 特色增强

- **快捷键优化**：默认 `Enter` 触发翻译，`Ctrl + Enter` (或 `Cmd + Enter`) 实现换行，更符合现代即时通讯工具的使用习惯。
- **偏好设置云同步**：您选择的 AI 模型、自定义提示词和翻译模式现在会自动保存到服务器。在任何设备登录，您的工作台都会保持一致。
- **智能中英互译**：优化了“中英自动互译”模式。首次使用无需手动选择目标语言，后端会自动智能判定并即时翻译。
- **卓越的稳定性**：修复了 Docker 启动路径 Bug 以及 API 校验规则，实现了“开箱即用”的丝滑部署体验。
- **隐私保护**：翻译请求由浏览器直连服务商，API 密钥加密存储在您自己的服务器上，安全可控。

## 功能特性

- **服务端鉴权**：内置基于 JWT 的完整登录、刷新令牌和会话保持系统。
- **密钥落库加密**：模型服务商 API Key 使用 AES 加密后存入 SQLite 数据库。
- **自定义提示词**：支持创建专属翻译角色（医疗、法律、科技等），且支持账号同步。
- **支持 186 种语言**：覆盖主流自然语言、方言及部分人造语言。
- **现代化 UI**：基于 shadcn/ui 和 Tailwind CSS，支持深色/浅色/系统主题切换。

## 快速开始 <a id="quick-start"></a>

1. **Docker 启动**：直接运行预构建镜像（详见[部署教程](#deploy)）。
2. **登录系统**：默认账号密码为 `admin` / `admin` (可通过环境变量自定义)。
3. **配置服务商**：在设置中添加您的 API Key（支持 OpenAI、硅基流动、Anthropic 等）。
4. **开始翻译**：切换到“中英自动互译”模式，享受最极致的翻译体验。

## 部署教程 <a id="deploy"></a>

此版本针对 Docker + Nginx 反向代理环境进行了深度适配。

### 推荐 Docker 运行（数据持久化）

请将 `itsrory` 替换为您自己的 Docker Hub 用户名，或使用本地构建的镜像。

```bash
docker run -d \
  --name translate-app \
  --restart always \
  -p 8081:8081 \
  -v $(pwd)/translate-data:/app/data \
  -e ADMIN_PASSWORD='your-password' \
  -e JWT_SECRET='random-string' \
  -e ENCRYPTION_KEY='random-string' \
  itsrory/translate-app:latest
```

> **重要提示**：请务必挂载 `-v $(pwd)/translate-data:/app/data`，以确保容器更新时您的设置和 API 密钥不会丢失。

### Nginx 反代与 HTTPS (Cloudflare + Certbot)

如果您想通过 `https://translate.yourdomain.com` 访问：

1.  **Nginx 配置**:
    ```nginx
    server {
        listen 80;
        server_name translate.yourdomain.com;
        location / {
            proxy_pass http://127.0.0.1:8081;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
        }
    }
    ```
2.  **SSL 证书**: 运行 `sudo certbot --nginx -d translate.yourdomain.com`。
3.  **Cloudflare**: 将 DNS 设置为 **Proxied (橙色小云朵)** 并将 SSL 设置为 **Full (strict)**。

## 技术栈

- **前端**: React, Vite, TypeScript, shadcn/ui, Tailwind, Dexie.js
- **后端**: Go (Gin), SQLite, GORM

## 贡献与反馈

欢迎在 [GitHub 仓库](https://github.com/its-rory/translate) 提交 Pull Request 或 Issue。

## 开源协议

本项目采用 MIT 协议。
