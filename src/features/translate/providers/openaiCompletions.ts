import OpenAI from "openai";
import type { ProviderTranslateFn } from "@/types/translate";

export const streamWithOpenAICompletions: ProviderTranslateFn = async ({
    provider,
    model,
    sourceText,
    promptContent,
    onDelta,
    signal,
}) => {
    try {
        const client = new OpenAI({
            apiKey: provider.api_key,
            baseURL: `${provider.base_url}/v1`,
            dangerouslyAllowBrowser: true,
            timeout: 60 * 1000, // 60 seconds timeout
        });

        const stream = await client.chat.completions.create(
            {
                model,
                stream: true,
                messages: [
                    { role: "system", content: promptContent },
                    { role: "user", content: sourceText },
                ],
            },
            {
                signal,
            }
        );

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                onDelta(content);
            }
        }
    } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
            throw error;
        }

        if (error instanceof OpenAI.APIError) {
            throw {
                message: error.message,
                status: error.status,
                body: error.error ? JSON.stringify(error.error, null, 2) : undefined,
            };
        }

        if (error instanceof Error) {
            throw {
                message: error.message,
            };
        }

       throw {
            message: "OpenAI Chat Completions request failed",
        };
    }
};