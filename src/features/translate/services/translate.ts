import { db } from "@/db";
import { usePreferences } from "@/stores/preferences.store";
import { providerTranslators } from "../providers";
import { buildTranslationPrompt } from "./buildTranslationPrompt";

export async function runTranslate(signal?: AbortSignal) {
    const {
        sourceText,
        targetLanguage,
        selectedModel,
        selectedPromptId,
        setTranslatedText,
    } = usePreferences.getState();

    if (!sourceText.trim()) {
        throw new Error("Source text is empty");
    }

    if (!targetLanguage) {
        throw new Error("Target language is required");
    }

    if (!selectedModel) {
        throw new Error("Model is required");
    }

    if (selectedPromptId == null) {
        throw new Error("Prompt is required");
    }

    const provider = await db.model_providers.get(selectedModel.providerId);
    if (!provider) {
        throw new Error("Provider not found");
    }

    const prompt = await db.translation_prompts.get(selectedPromptId);
    if (!prompt) {
        throw new Error("Prompt not found");
    }

    const finalPrompt = buildTranslationPrompt({
        promptContent: prompt.content,
        targetLanguage,
    });

    setTranslatedText("");

    const translator =
        providerTranslators[provider.api_style as keyof typeof providerTranslators];

    if (!translator) {
        throw new Error(`Unsupported api style: ${provider.api_style}`);
    }

    await translator({
        provider,
        model: selectedModel.model,
        targetLanguage,
        sourceText,
        promptContent: finalPrompt,
        onDelta: (delta) => {
            const current = usePreferences.getState().translatedText;
            usePreferences.getState().setTranslatedText(current + delta);
        },
        signal,
    });
}