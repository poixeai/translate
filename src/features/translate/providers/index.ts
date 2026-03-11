import { streamWithOpenAICompletions } from "./openaiCompletions";

export const providerTranslators = {
    openai_completions: streamWithOpenAICompletions,
} as const;