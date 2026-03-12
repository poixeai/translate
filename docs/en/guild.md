# Poixe Translate User Guide (Illustrated Version)

Poixe Translate is an open-source, lightweight web-based translation tool powered by AI large language models.

No complex registration is required — just complete the basic setup and you can start translating.

Github repository: [https://github.com/poixeai/translate](https://github.com/poixeai/translate)

![Poixe Translate Preview](../assets/poster-0.png)

## Workflow

### Step 1: Configure Model Providers

Click the **Settings** button in the upper-right corner to open the configuration panel, then add a model provider (Provider) on the **Models** page.

You need to fill in the following information:

* **Name**: Provider name
* **API Endpoint**: API endpoint URL
* **API Key**: Access key
* **API Style**: API protocol type
* **Model List**: List of models supported by this provider

Poixe Translate currently supports the following 4 mainstream protocols:

* OpenAI `/v1/chat/completions`
* OpenAI `/v1/responses`
* Anthropic `/v1/messages`
* Google Gemini `generateContent`

> As long as your service provider is compatible with one of the protocols above, it can usually be connected, such as OpenAI, Anthropic, Gemini, OpenRouter, various OpenAI-compatible platforms, or self-hosted compatible gateways.

![manage model](../assets/guide-0.png)

### Step 2: Select a Model

After completing the Provider configuration, return to the main interface and select the model you want to use from the model selector at the top.

You can:

* Search for model names
* Quickly switch between different models
* Pin frequently used models for easier access later

This step determines which AI model will actually perform the translation task.

![select model](../assets/guide-2.png)

### Step 3: Select the Target Language

Select the target language at the top of the main interface to specify which language the text should be translated into.

Poixe Translate currently supports **186 languages**, covering most everyday, multilingual, and professional translation scenarios.

You can quickly locate the target language through search to improve selection efficiency.

![select target language](../assets/guide-3.png)

### Step 3: Select a Translation Prompt

Choose a translation prompt in the upper-right area of the main interface to control the tone, terminology, and style of the translation.

Built-in prompt examples:

* General
* Professional
* Technology
* Legal
* Education
* Finance
* Medical

![select prompt](../assets/guide-4.png)

You can also go to the **Prompts** page in the settings panel to:

* Create custom prompts
* Edit existing prompts
* Delete prompts you no longer need

> Prompts participate in the translation process as system prompts, and can be used to constrain tone, professional domain, terminology preferences, and writing style.

![manage prompt](../assets/guide-1.png)

### Final Step: Start Translating

At this point, all configuration is complete, and you can enter content to translate.
