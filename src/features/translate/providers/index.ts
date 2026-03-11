import { streamWithOpenAICompletions } from "./openaiCompletions";
import { streamWithOpenAIResponses } from "./openaiResponses";
import { streamWithAnthropicMessages } from "./anthropicMessages";
import { streamWithGoogleGeminiContent } from "./googleGeminiContent";

export const providerTranslators = {
    openai_completions: streamWithOpenAICompletions,
    openai_responses: streamWithOpenAIResponses,
    anthropic_messages: streamWithAnthropicMessages,
    google_gemini_content: streamWithGoogleGeminiContent,
} as const;