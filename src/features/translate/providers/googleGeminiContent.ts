import { GoogleGenAI } from "@google/genai";
import type { ProviderTranslateFn } from "@/types/translate";

export const streamWithGoogleGeminiContent: ProviderTranslateFn = async ({
    provider,
    model,
    sourceText,
    promptContent,
    onDelta,
    signal,
}) => {
    try {
        const ai = new GoogleGenAI({
            apiKey: provider.api_key,
            httpOptions: {
                baseUrl: provider.base_url,
                timeout: 60 * 1000, // 60 seconds timeout
            },
        });

        const stream = await ai.models.generateContentStream({
            model,
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `${promptContent}\n\n${sourceText}`,
                        },
                    ],
                },
            ],
        });

        for await (const chunk of stream) {
            if (signal?.aborted) {
                throw new DOMException("Aborted", "AbortError");
            }

            if (chunk.text) {
                onDelta(chunk.text);
            }
        }
    } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
            throw error;
        }

        if (error instanceof Error) {
            throw {
                message: error.message,
            };
        }

        throw {
            message: "Google Gemini request failed",
        };
    }
};