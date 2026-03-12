<div align="center">
  <a href="https://github.com/poixeai/translate">
    <img src="./public/x.svg" alt="logo" width="100" height="100">
  </a>
  <h1>Poixe Translate</h1>
  <p>A lightweight web translation tool powered by AI</p>

  English / [简体中文](./README_CN.md)

  <p>
    <a href="https://github.com/poixeai/translate/blob/main/LICENSE">
      <img alt="License" src="https://img.shields.io/github/license/poixeai/translate?style=for-the-badge&color=blue">
    </a>
    <a href="https://github.com/poixeai/translate">
      <img alt="Vite" src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white">
    </a>
    <a href="https://github.com/poixeai/translate/stargazers">
      <img alt="Stars" src="https://img.shields.io/github/stars/poixeai/translate?style=for-the-badge&logo=github">
    </a>
    <a href="https://github.com/poixeai/translate/issues">
      <img alt="Issues" src="https://img.shields.io/github/issues/poixeai/translate?style=for-the-badge&logo=github">
    </a>
  </p>

  <h4>
    <a href="https://translate.poixe.com">Live Demo</a>
    <span> · </span>
    <a href="#quick-start">Quick Start</a>
    <span> · </span>
    <a href="#deploy">Deployment</a>
    <span> · </span>
    <a href="#model">Supported Models</a>
    <span> · </span>
    <a href="#language">Translation Languages</a>
  </h4>
  
  <img src="./docs/assets/poster-1.png" alt="poster">
</div>

---

Poixe Translate is an open-source web translation tool powered by AI large language models. All configuration data is stored locally in the browser, and all model requests are sent directly from the browser, ensuring privacy and API key security. It supports custom AI model providers, 4 mainstream API protocols, and 186 languages, along with user-defined translation prompts to meet translation needs ranging from everyday communication to professional domains.

## Features

- **Browser-local requests**: All model requests are sent directly from the browser, ensuring user privacy and API key security.
- **Custom model providers supported**: You can define your own model providers by configuring the API Endpoint, API Key, API protocol, and model list, and switch freely between different models.
- **Supports 4 mainstream AI API protocols**: Easily connect to different AI service providers or compatible platforms with flexible extensibility.
- **Custom translation prompts supported**: Supports custom prompts, allowing users to tailor translation logic based on professional domains (such as legal, IT, or medical) or specific tones for highly accurate contextual translation.
- **Supports 186 translation languages**: Covers natural languages, regional language variants, dialects, ancient languages, and some constructed languages.
- **Supports 15 UI languages**: Suitable for global use and open-source distribution.
- **Theme switching**: Supports following the system theme as well as manual theme switching.
- **Easy deployment**: Can be deployed as a static site and also supports multiple methods including Docker, Vercel, Nginx, and BT Panel.
- **Local persistent storage**: Configuration data is stored via IndexedDB for a better user experience.

## Tech Stack

This project is built with a modern web technology stack to ensure high performance and a great developer experience:

- React
- Vite
- TypeScript
- shadcn/ui
- Tailwind CSS 
- Dexie.js (IndexedDB)

## Quick Start <a id="quick-start"></a>

Getting started with this tool requires no complicated registration process. Just complete the basic configuration and you can begin translating:

1. **Configure a model provider**: Click the settings button in the upper-right corner to open the configuration panel, then add a model provider and fill in the Endpoint, API Key, choose the API protocol type, and enter the supported model list.
2. **Select a model**: On the main interface, choose the AI model you want to use, which is the one configured in the previous step.
3. **Select a target language**: On the main interface, choose the target language for translation. A total of 186 languages are supported.
4. **Select a translation prompt**: On the main interface, choose a built-in translation prompt (such as finance or general), or use a custom prompt to constrain translation style.
5. **Start translating**: Enter the text you want to translate in the input box and click the translate button to get the result.

> For the illustrated tutorial, see [User Guide (Illustrated)](docs/en/guild.md).

## Supported AI Models <a id="model"></a>

Poixe Translate currently supports 4 mainstream AI API protocols and can connect to platforms, model services, or self-hosted gateways compatible with these protocols.

### Supported API Protocols

| Name | Path | Official Documentation |
|---|---|---|
| OpenAI Chat Completions | `/v1/chat/completions` | [Official Docs](https://developers.openai.com/api/reference/resources/chat) |
| OpenAI Responses | `/v1/responses` | [Official Docs](https://developers.openai.com/api/reference/resources/responses/methods/create) |
| Anthropic Messages | `/v1/messages` | [Official Docs](https://platform.claude.com/docs/en/api/messages/create) |
| Google Gemini Generate Content | `/v1beta/models/{model}:generateContent` | [Official Docs](https://ai.google.dev/gemini-api/docs/text-generation?hl=zh-cn) |

### Compatible Model Services

As long as your provider is compatible with the protocols above, it can usually be connected, for example:

* OpenAI
* Anthropic Claude
* Google Gemini
* DeepSeek
* Grok
* Qwen
* Self-hosted compatible gateways
* Other model aggregation platforms

### Required Fields When Configuring a Model Provider

* Name
* API Endpoint
* API Key
* API Style
* Model List

This means you can freely switch between different model sources according to your needs without being locked into a single platform.

## Supported Translation Languages <a id="language"></a>

Poixe Translate currently supports **186 translation languages**, covering major global languages as well as many regional language variants, suitable for translation needs in daily communication, study, work, and professional scenarios.

Below are just some of the supported languages:

- English
- 简体中文
- 繁體中文
- 日本語
- 한국어
- Français
- Deutsch
- Español
- Português
- Русский
- हिन्दी
- Bahasa Indonesia
- Italiano
- Nederlands

> For the full language list, please refer to the actual supported content in the application.

## Deployment <a id="deploy"></a>

Poixe Translate is a pure front-end project, so deployment is very flexible. You can choose Docker, Vercel, BT Panel, or manual deployment.

### Docker

**Option 1: Build from Dockerfile**

```bash
# Clone the source code
git clone https://github.com/poixeai/translate.git
cd translate

# Build the image
docker build -t poixeai/translate:latest .

# Run the container
docker run -d \
  -p 8080:80 \
  --name poixe-translate \
  --restart=always \
  poixeai/translate:latest
````

Visit `http://localhost:8080`

```bash
# View logs
docker logs -f poixe-translate

# Remove the container
docker rm -f poixe-translate
```

**Option 2: Use Docker Compose**

```bash
# Clone the source code
git clone https://github.com/poixeai/translate.git
cd translate

# Start
docker compose up -d

# Stop
docker compose down

# Rebuild and start
docker compose up -d --build
```

**Option 3: Pull from Docker Hub**

```bash
docker pull terobox/translate:latest

docker run -d \
  -p 8080:80 \
  --name poixe-translate \
  --restart=always \
  terobox/translate:latest
```

### Vercel

If you want the easiest way to get online quickly, you can deploy directly to Vercel. Click the button below for one-click deployment with zero configuration.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/poixeai/translate&repository-name=poixe-translate)

### BT Panel

> See [BT Panel Deployment Guide](docs/en/deploy-bt.md).

### Manual Deployment

```bash
# Install dependencies
npm install

# Build the production version
npm run build
```

The build output is located in the `dist/` directory. Deploy it to any static file server (such as Nginx, Caddy, Apache, etc.).

## Contributing

Issues and Pull Requests are welcome.

## License

This project is licensed under the [MIT License](./LICENSE).