
export function buildTranslationPrompt({
    promptContent,
    targetLanguage,
}: {
    promptContent: string;
    targetLanguage: string;
}) {
    return `${promptContent}\n请将上面的文本翻译成${targetLanguage}。`;
}