import { LANGUAGES } from "@/constants/languages";
import { AUTO_SOURCE_LANGUAGE, type TranslationMode } from "@/stores/preferences.store";

export function getPromptLanguageName(code: string) {
    if (code === AUTO_SOURCE_LANGUAGE) return "the detected source language";

    return LANGUAGES.find((lang) => lang.code === code)?.promptName ?? code;
}

export function buildTranslationPrompt({
    promptContent,
    sourceLanguage,
    targetLanguage,
    translationMode,
}: {
    promptContent: string;
    sourceLanguage: string;
    targetLanguage: string;
    translationMode: TranslationMode;
}) {
    if (translationMode === "zh_en_auto") {
        return [
            promptContent,
            "Translate between Chinese and English automatically.",
            "If the user's input is Chinese, translate it into natural English.",
            "If the user's input is English, translate it into natural Simplified Chinese.",
            "Only output the translation result. Do not explain the detected language.",
        ].join("\n");
    }

    const sourceLanguageName = getPromptLanguageName(sourceLanguage);
    const targetLanguageName = getPromptLanguageName(targetLanguage);

    if (sourceLanguage === AUTO_SOURCE_LANGUAGE) {
        return [
            promptContent,
            `Detect the user's input language and translate it into ${targetLanguageName}.`,
            "Only output the translation result.",
        ].join("\n");
    }

    return [
        promptContent,
        `Translate the user's input from ${sourceLanguageName} into ${targetLanguageName}.`,
        "Only output the translation result.",
    ].join("\n");
}