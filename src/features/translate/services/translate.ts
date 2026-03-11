import { db } from "@/db";
import { usePreferences } from "@/stores/preferences.store";
import { providerTranslators } from "../providers";
import { buildTranslationPrompt } from "./buildTranslationPrompt";
import { TranslateKnownError } from "./translateError";

export async function runTranslate(signal?: AbortSignal) {
    const {
        sourceText,
        targetLanguage,
        selectedModel,
        selectedPromptId,
        setTranslatedText,
    } = usePreferences.getState();

    if (!sourceText.trim()) {
        throw new TranslateKnownError("source_text_empty");
    }

    if (!selectedModel) {
        throw new TranslateKnownError("model_required");
    }

    if (!targetLanguage) {
        throw new TranslateKnownError("target_language_required");
    }

    if (selectedPromptId == null) {
        throw new TranslateKnownError("prompt_required");
    }

    const provider = await db.model_providers.get(selectedModel.providerId);
    if (!provider) {
        throw new TranslateKnownError("provider_not_found");
    }

    const prompt = await db.translation_prompts.get(selectedPromptId);
    if (!prompt) {
        throw new TranslateKnownError("prompt_not_found");
    }

    const finalPrompt = buildTranslationPrompt({
        promptContent: prompt.content,
        targetLanguage,
    });

    setTranslatedText("");

    const translator =
        providerTranslators[provider.api_style as keyof typeof providerTranslators];

    if (!translator) {
        throw new TranslateKnownError("unsupported_api_style");
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