import { LANGUAGES } from "@/constants/languages";

export function getPromptLanguageName(code: string) {
    return LANGUAGES.find((lang) => lang.code === code)?.promptName ?? code;
}

export function buildTranslationPrompt({
    promptContent,
    targetLanguage,
}: {
    promptContent: string;
    targetLanguage: string;
}) {
    const targetLanguageName = getPromptLanguageName(targetLanguage);

    return `${promptContent}\nPlease translate the user's input into ${targetLanguageName}.`;
}